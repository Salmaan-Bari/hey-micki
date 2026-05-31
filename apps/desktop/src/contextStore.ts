export type ProjectContext = {
  workspaceName?: string;
  fileTree?: string[];
  packageJson?: {
    name?: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  readme?: string;
  currentFile?: {
    path?: string;
    languageId?: string;
    contentPreview?: string;
  };
  signals?: {
    frameworks?: string[];
    packageManager?: string;
    hasAuth?: boolean;
    hasDatabase?: boolean;
    hasTests?: boolean;
    hasDeploymentConfig?: boolean;
  };
};

export type ContextSummary = {
  hasContext: boolean;
  workspaceName: string | null;
  fileCount: number;
  frameworks: string[];
  packageManager: string | null;
};

let latestContext: ProjectContext | null = null;

export function setLatestContext(context: ProjectContext) {
  latestContext = context;
}

export function getLatestContext() {
  return latestContext;
}

export function getContextSummary(): ContextSummary {
  if (!latestContext) {
    return {
      hasContext: false,
      workspaceName: null,
      fileCount: 0,
      frameworks: [],
      packageManager: null
    };
  }

  return {
    hasContext: true,
    workspaceName: latestContext.workspaceName ?? null,
    fileCount: latestContext.fileTree?.length ?? 0,
    frameworks: latestContext.signals?.frameworks ?? [],
    packageManager: latestContext.signals?.packageManager ?? null
  };
}
