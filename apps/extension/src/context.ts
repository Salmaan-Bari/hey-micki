import * as path from "node:path";
import * as vscode from "vscode";

const MAX_FILE_TREE_ITEMS = 250;
const MAX_TEXT_PREVIEW_CHARS = 4000;
const MAX_ACTIVE_FILE_PREVIEW_CHARS = 1200;
const EXCLUDED_FOLDERS = [
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "coverage",
  ".venv",
  "venv"
];

export type ProjectContext = {
  workspaceName: string;
  fileTree: string[];
  packageJson?: {
    name?: string;
    scripts?: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  readme?: string;
  currentFile?: {
    path: string;
    languageId: string;
    contentPreview: string;
  };
  signals: {
    frameworks: string[];
    packageManager: string;
    hasAuth: boolean;
    hasDatabase: boolean;
    hasTests: boolean;
    hasDeploymentConfig: boolean;
  };
};

export async function scanProjectContext(): Promise<ProjectContext> {
  const workspaceFolder = getWorkspaceFolder();

  if (!workspaceFolder) {
    throw new Error("Open a workspace before sending context to Micki.");
  }

  const fileTree = await readFileTree(workspaceFolder);
  const packageJson = await readPackageJson(workspaceFolder);
  const readme = await readOptionalTextFile(workspaceFolder, "README.md");
  const currentFile = getCurrentFile(workspaceFolder);
  const packageManager = await detectPackageManager(workspaceFolder, packageJson);
  const frameworks = detectFrameworks(packageJson);

  return {
    workspaceName: workspaceFolder.name,
    fileTree,
    packageJson,
    readme,
    currentFile,
    signals: {
      frameworks,
      packageManager,
      hasAuth: hasAnyDependency(packageJson, ["next-auth", "@clerk/nextjs", "@auth/core", "passport"]),
      hasDatabase: hasAnyDependency(packageJson, ["prisma", "@prisma/client", "drizzle-orm", "mongoose", "pg"]),
      hasTests: hasAnyDependency(packageJson, ["vitest", "jest", "@playwright/test", "cypress"]),
      hasDeploymentConfig: fileTree.some((filePath) =>
        ["vercel.json", "netlify.toml", "Dockerfile", "docker-compose.yml"].includes(filePath)
      )
    }
  };
}

export function getContextSummary(context: ProjectContext) {
  return {
    workspaceName: context.workspaceName,
    fileCount: context.fileTree.length,
    frameworks: context.signals.frameworks,
    packageManager: context.signals.packageManager,
    currentFile: context.currentFile?.path ?? null,
    currentFileName: context.currentFile ? path.basename(context.currentFile.path) : null,
    hasPackageJson: Boolean(context.packageJson),
    hasReadme: Boolean(context.readme)
  };
}

function getWorkspaceFolder() {
  const activeDocumentUri = vscode.window.activeTextEditor?.document.uri;

  if (activeDocumentUri) {
    const activeWorkspaceFolder = vscode.workspace.getWorkspaceFolder(activeDocumentUri);

    if (activeWorkspaceFolder) {
      return activeWorkspaceFolder;
    }
  }

  return vscode.workspace.workspaceFolders?.[0];
}

async function readFileTree(workspaceFolder: vscode.WorkspaceFolder) {
  const excludePattern = `{${EXCLUDED_FOLDERS.map((folder) => `**/${folder}/**`).join(",")}}`;
  const files = await vscode.workspace.findFiles(
    new vscode.RelativePattern(workspaceFolder, "**/*"),
    excludePattern,
    MAX_FILE_TREE_ITEMS
  );

  return files
    .map((file) => path.posix.normalize(vscode.workspace.asRelativePath(file, false)))
    .sort();
}

async function readPackageJson(workspaceFolder: vscode.WorkspaceFolder) {
  const text = await readOptionalTextFile(workspaceFolder, "package.json");

  if (!text) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(text) as ProjectContext["packageJson"];
    return {
      name: parsed?.name,
      scripts: parsed?.scripts,
      dependencies: parsed?.dependencies,
      devDependencies: parsed?.devDependencies
    };
  } catch {
    return undefined;
  }
}

async function readOptionalTextFile(workspaceFolder: vscode.WorkspaceFolder, relativePath: string) {
  const uri = vscode.Uri.joinPath(workspaceFolder.uri, relativePath);

  try {
    const stat = await vscode.workspace.fs.stat(uri);

    if (stat.size > MAX_TEXT_PREVIEW_CHARS * 8) {
      return undefined;
    }

    const bytes = await vscode.workspace.fs.readFile(uri);
    return new TextDecoder("utf-8").decode(bytes).slice(0, MAX_TEXT_PREVIEW_CHARS);
  } catch {
    return undefined;
  }
}

function getCurrentFile(workspaceFolder: vscode.WorkspaceFolder) {
  const document = vscode.window.activeTextEditor?.document;

  if (!document || document.uri.scheme !== "file") {
    return undefined;
  }

  const relativePath = vscode.workspace.asRelativePath(document.uri, false);
  const normalizedPath = path.posix.normalize(relativePath);

  if (!normalizedPath || normalizedPath.startsWith("..") || path.isAbsolute(normalizedPath)) {
    return undefined;
  }

  if (!document.uri.fsPath.startsWith(workspaceFolder.uri.fsPath)) {
    return undefined;
  }

  if (isExcludedPath(normalizedPath)) {
    return undefined;
  }

  return {
    path: normalizedPath,
    languageId: document.languageId,
    contentPreview: createContentPreview(document.getText(), MAX_ACTIVE_FILE_PREVIEW_CHARS)
  };
}

function createContentPreview(text: string, maxChars: number) {
  return text.replace(/\r\n/g, "\n").slice(0, maxChars);
}

function isExcludedPath(relativePath: string) {
  const parts = relativePath.split("/");

  return parts.some((part) => EXCLUDED_FOLDERS.includes(part));
}

async function detectPackageManager(
  workspaceFolder: vscode.WorkspaceFolder,
  packageJson: ProjectContext["packageJson"]
) {
  if (await fileExists(workspaceFolder, "package-lock.json")) {
    return "npm";
  }

  if (await fileExists(workspaceFolder, "pnpm-lock.yaml")) {
    return "pnpm";
  }

  if (await fileExists(workspaceFolder, "yarn.lock")) {
    return "yarn";
  }

  if (await fileExists(workspaceFolder, "bun.lockb")) {
    return "bun";
  }

  if (hasNpmStyleScripts(packageJson)) {
    return "npm";
  }

  return "unknown";
}

async function fileExists(workspaceFolder: vscode.WorkspaceFolder, relativePath: string) {
  try {
    await vscode.workspace.fs.stat(vscode.Uri.joinPath(workspaceFolder.uri, relativePath));
    return true;
  } catch {
    return false;
  }
}

function detectFrameworks(packageJson: ProjectContext["packageJson"]) {
  const dependencies = getAllDependencies(packageJson);
  const frameworks = new Set<string>();

  const dependencyToFramework: Record<string, string> = {
    next: "Next.js",
    react: "React",
    "react-dom": "React",
    vue: "Vue",
    "@vitejs/plugin-react": "Vite",
    "@vitejs/plugin-react-swc": "Vite",
    vite: "Vite",
    svelte: "Svelte",
    astro: "Astro",
    electron: "Electron",
    express: "Express",
    fastify: "Fastify",
    typescript: "TypeScript"
  };

  for (const [dependencyName, frameworkName] of Object.entries(dependencyToFramework)) {
    if (dependencies[dependencyName]) {
      frameworks.add(frameworkName);
    }
  }

  return Array.from(frameworks);
}

function hasAnyDependency(packageJson: ProjectContext["packageJson"], dependencyNames: string[]) {
  const dependencies = getAllDependencies(packageJson);

  return dependencyNames.some((dependencyName) => Boolean(dependencies[dependencyName]));
}

function getAllDependencies(packageJson: ProjectContext["packageJson"]) {
  return {
    ...packageJson?.dependencies,
    ...packageJson?.devDependencies
  };
}

function hasNpmStyleScripts(packageJson: ProjectContext["packageJson"]) {
  if (!packageJson?.scripts) {
    return false;
  }

  return Object.values(packageJson.scripts).some(
    (script) =>
      typeof script === "string" &&
      /\b(vite|tsc|react-scripts|next|npm|node|tsx|webpack|parcel|astro|svelte-kit)\b/.test(script)
  );
}
