import type { ProjectContext } from "./contextStore.js";

export type MickiAnswer = {
  projectSummary: string;
  detectedStack: string[];
  missingProductionPieces: string[];
  readinessScore: number;
  nextBestStep: string;
  simpleExplanation: string;
  agentPrompt: string;
};

export function answerMicki(question: string, context: ProjectContext | null): MickiAnswer {
  const detectedStack = getDetectedStack(context);
  const missingProductionPieces = getMissingProductionPieces(context);
  const readinessScore = getReadinessScore(context, missingProductionPieces);
  const nextBestStep = getNextBestStep(context, missingProductionPieces);
  const projectSummary = getProjectSummary(context, detectedStack);
  const simpleExplanation = getSimpleExplanation(context, missingProductionPieces, detectedStack);

  return {
    projectSummary,
    detectedStack,
    missingProductionPieces,
    readinessScore,
    nextBestStep,
    simpleExplanation,
    agentPrompt: createAgentPrompt(question, context, detectedStack, missingProductionPieces, nextBestStep)
  };
}

function getDetectedStack(context: ProjectContext | null) {
  const frameworks = context?.signals?.frameworks ?? [];
  const dependencies = getAllDependencies(context);
  const stack = new Set(frameworks);

  if (dependencies.react) {
    stack.add("React");
  }

  if (dependencies.typescript) {
    stack.add("TypeScript");
  }

  if (dependencies.electron) {
    stack.add("Electron");
  }

  if (dependencies.vite) {
    stack.add("Vite");
  }

  return orderStack(Array.from(stack));
}

function getMissingProductionPieces(context: ProjectContext | null) {
  if (!context) {
    return ["project context"];
  }

  const signals = context.signals;
  const fileTree = context.fileTree ?? [];
  const readme = context.readme ?? "";
  const missing: string[] = [];

  if (!signals?.hasTests) {
    missing.push("tests");
  }

  if (!signals?.hasAuth) {
    missing.push("auth or user identity decision");
  }

  if (!signals?.hasDatabase) {
    missing.push("database or persistence");
  }

  if (!hasEnvExample(fileTree)) {
    missing.push("environment setup");
  }

  if (!signals?.hasDeploymentConfig) {
    missing.push("deployment config");
  }

  if (!hasProductionDocs(readme)) {
    missing.push("production documentation");
  }

  return missing;
}

function getReadinessScore(context: ProjectContext | null, missingProductionPieces: string[]) {
  if (!context) {
    return 0;
  }

  let score = 36;

  const detectedStack = getDetectedStack(context);
  const packageManager = context.signals?.packageManager;
  const fileCount = context.fileTree?.length ?? 0;
  const hasPackageJson = Boolean(context.packageJson);
  const hasReadme = Boolean(context.readme);

  score += Math.min(detectedStack.length * 5, 18);
  score += packageManager && packageManager !== "unknown" ? 8 : 0;
  score += hasPackageJson ? 8 : 0;
  score += hasReadme ? 6 : 0;
  score += fileCount > 0 ? 4 : 0;

  const penalties: Record<string, number> = {
    tests: 9,
    "auth or user identity decision": 5,
    "database or persistence": 10,
    "environment setup": 6,
    "deployment config": 7,
    "production documentation": 5,
    "project context": 100
  };

  for (const piece of missingProductionPieces) {
    score -= penalties[piece] ?? 8;
  }

  return clamp(score, 0, 100);
}

function getNextBestStep(context: ProjectContext | null, missingProductionPieces: string[]) {
  if (!context) {
    return "Send project context from VS Code before asking Micki what to do next.";
  }

  if (isSampleVibeApp(context)) {
    return "Add a tiny production-readiness pass: document exact local setup, add a manual QA checklist for the task list, and decide where tasks will be persisted.";
  }

  if (missingProductionPieces.includes("environment setup") || missingProductionPieces.includes("production documentation")) {
    return "Write a focused README setup section with exact install/run commands, required environment variables, and a short manual QA checklist.";
  }

  if (missingProductionPieces.includes("database or persistence")) {
    return "Decide the smallest persistence path for the MVP and document whether data stays local or needs a real backend.";
  }

  if (missingProductionPieces.includes("tests")) {
    return "Add one small test or manual QA checklist for the most important user flow.";
  }

  if (missingProductionPieces.length > 0) {
    return `Decide whether ${missingProductionPieces[0]} is needed for this MVP before shipping.`;
  }

  return "Run a full local QA pass and write down the remaining launch risks.";
}

function getProjectSummary(context: ProjectContext | null, detectedStack: string[]) {
  if (!context) {
    return "Micki has not received project context yet.";
  }

  const workspaceName = context.workspaceName ?? context.packageJson?.name ?? "this project";
  const fileCount = context.fileTree?.length ?? 0;
  const productDescription = describeProject(context);
  const stackText = detectedStack.length > 0 ? ` It uses ${formatList(detectedStack)}.` : "";
  const packageText = context.signals?.packageManager
    ? ` Package manager signal: ${context.signals.packageManager}.`
    : "";

  return `${workspaceName} looks like ${productDescription}. Micki scanned ${fileCount} project files.${stackText}${packageText}`;
}

function getSimpleExplanation(
  context: ProjectContext | null,
  missingProductionPieces: string[],
  detectedStack: string[]
) {
  if (!context) {
    return "The local app is ready, but Micki needs project context before giving useful next-step advice.";
  }

  if (missingProductionPieces.length === 0) {
    return "The project has the main readiness signals Micki can detect from the current context. The next move is a local QA pass before expanding scope.";
  }

  const stackText = detectedStack.length > 0 ? formatList(detectedStack) : "the detected stack";
  const missingText = formatList(missingProductionPieces);

  return `This is a useful ${stackText} starting point, but it is still a prototype. It has a frontend scaffold and readable project context, while the shipping basics are not in place yet: ${missingText}.`;
}

function createAgentPrompt(
  question: string,
  context: ProjectContext | null,
  detectedStack: string[],
  missingProductionPieces: string[],
  nextBestStep: string
) {
  const workspaceName = context?.workspaceName ?? context?.packageJson?.name ?? "this project";
  const stackText = detectedStack.length > 0 ? formatList(detectedStack) : "the detected project stack";
  const missingText =
    missingProductionPieces.length > 0 ? formatList(missingProductionPieces) : "no obvious production gaps";
  const task = getPromptTask(context, missingProductionPieces);

  return [
    `You are helping with ${workspaceName}, ${describeProject(context)}.`,
    `Question: ${question || "What should I do next?"}`,
    `Detected stack: ${stackText}.`,
    `Missing pieces: ${missingText}.`,
    `Focused task: ${task}`,
    "",
    "Acceptance criteria:",
    "- Keep the change scoped to this one task.",
    "- Update or add only the files needed for the task.",
    "- Include exact local setup or manual QA steps in the README when relevant.",
    "- Do not add unrelated features, auth, payments, analytics, deployment services, or AI/model calls.",
    "",
    `Context from Micki: ${nextBestStep}`
  ].join("\n");
}

function getAllDependencies(context: ProjectContext | null) {
  return {
    ...context?.packageJson?.dependencies,
    ...context?.packageJson?.devDependencies
  };
}

function orderStack(stack: string[]) {
  const preferredOrder = ["React", "Vite", "TypeScript", "Next.js", "Electron", "Vue", "Svelte", "Astro"];

  return stack.sort((left, right) => {
    const leftIndex = preferredOrder.indexOf(left);
    const rightIndex = preferredOrder.indexOf(right);

    if (leftIndex === -1 && rightIndex === -1) {
      return left.localeCompare(right);
    }

    if (leftIndex === -1) {
      return 1;
    }

    if (rightIndex === -1) {
      return -1;
    }

    return leftIndex - rightIndex;
  });
}

function hasEnvExample(fileTree: string[]) {
  return fileTree.some((filePath) => [".env.example", ".env.sample", "env.example"].includes(filePath));
}

function hasProductionDocs(readme: string) {
  const normalized = readme.toLowerCase();

  return (
    normalized.includes("npm install") &&
    (normalized.includes("npm run dev") || normalized.includes("npm start")) &&
    (normalized.includes("deploy") || normalized.includes("production")) &&
    (normalized.includes("test") || normalized.includes("qa"))
  );
}

function describeProject(context: ProjectContext | null) {
  if (!context) {
    return "project that has not sent context yet";
  }

  const workspaceName = `${context.workspaceName ?? context.packageJson?.name ?? ""} ${context.readme ?? ""}`.toLowerCase();
  const stack = getDetectedStack(context);
  const stackText = stack.includes("React") && stack.includes("Vite") && stack.includes("TypeScript")
    ? "React/Vite/TypeScript"
    : stack.length > 0
      ? formatList(stack)
      : "frontend";

  if (workspaceName.includes("vibe tasks") || workspaceName.includes("sample-vibe-app")) {
    return `an early-stage ${stackText} task manager prototype`;
  }

  if (workspaceName.includes("task")) {
    return `an early-stage ${stackText} task app`;
  }

  return `an early-stage ${stackText} project`;
}

function getPromptTask(context: ProjectContext | null, missingProductionPieces: string[]) {
  if (!context) {
    return "Add a clear empty state that asks the user to send project context from VS Code.";
  }

  if (isSampleVibeApp(context)) {
    return "Improve the README for Vibe Tasks with exact local setup commands, a short manual QA checklist, and a clear note that task data is currently in-memory only.";
  }

  if (missingProductionPieces.includes("environment setup") || missingProductionPieces.includes("production documentation")) {
    return "Improve the README with exact local setup commands, environment notes, and a short manual QA checklist.";
  }

  if (missingProductionPieces.includes("database or persistence")) {
    return "Document the smallest persistence decision for the MVP and the files that will need to change later.";
  }

  if (missingProductionPieces.includes("tests")) {
    return "Add a focused manual QA checklist or one small test for the primary user flow.";
  }

  return "Run a local QA pass and document any remaining launch risks.";
}

function isSampleVibeApp(context: ProjectContext) {
  const name = `${context.workspaceName ?? ""} ${context.packageJson?.name ?? ""} ${context.readme ?? ""}`.toLowerCase();

  return name.includes("sample-vibe-app") || name.includes("vibe-tasks") || name.includes("vibe tasks");
}

function formatList(items: string[]) {
  if (items.length === 0) {
    return "";
  }

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
