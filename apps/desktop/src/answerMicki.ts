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
  const simpleExplanation = getSimpleExplanation(context, missingProductionPieces);

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
  const dependencies = {
    ...context?.packageJson?.dependencies,
    ...context?.packageJson?.devDependencies
  };
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

  return Array.from(stack);
}

function getMissingProductionPieces(context: ProjectContext | null) {
  if (!context) {
    return ["project context"];
  }

  const signals = context.signals;
  const missing: string[] = [];

  if (!signals?.hasAuth) {
    missing.push("auth");
  }

  if (!signals?.hasDatabase) {
    missing.push("database");
  }

  if (!signals?.hasTests) {
    missing.push("tests");
  }

  if (!signals?.hasDeploymentConfig) {
    missing.push("deployment config");
  }

  return missing;
}

function getReadinessScore(context: ProjectContext | null, missingProductionPieces: string[]) {
  if (!context) {
    return 0;
  }

  return Math.max(10, 100 - missingProductionPieces.length * 20);
}

function getNextBestStep(context: ProjectContext | null, missingProductionPieces: string[]) {
  if (!context) {
    return "Send project context from VS Code before asking Micki what to do next.";
  }

  if (missingProductionPieces.includes("tests")) {
    return "Add a small test or manual QA checklist for the most important user flow.";
  }

  if (missingProductionPieces.includes("deployment config")) {
    return "Add a simple deployment or runbook note so the project has a clear shipping path.";
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
  const stackText = detectedStack.length > 0 ? ` It appears to use ${detectedStack.join(", ")}.` : "";

  return `${workspaceName} has ${fileCount} scanned files.${stackText}`;
}

function getSimpleExplanation(context: ProjectContext | null, missingProductionPieces: string[]) {
  if (!context) {
    return "The local app is ready, but Micki needs project context before giving useful next-step advice.";
  }

  if (missingProductionPieces.length === 0) {
    return "The project has the main readiness signals Micki can detect from the current context.";
  }

  return `The project has enough context to inspect, but it is still missing ${missingProductionPieces.join(", ")}.`;
}

function createAgentPrompt(
  question: string,
  context: ProjectContext | null,
  detectedStack: string[],
  missingProductionPieces: string[],
  nextBestStep: string
) {
  const workspaceName = context?.workspaceName ?? context?.packageJson?.name ?? "this project";
  const stackText = detectedStack.length > 0 ? detectedStack.join(", ") : "the detected project stack";
  const missingText = missingProductionPieces.length > 0 ? missingProductionPieces.join(", ") : "no obvious production gaps";

  return [
    `You are helping with ${workspaceName}.`,
    `Question: ${question || "What should I do next?"}`,
    `Detected stack: ${stackText}.`,
    `Missing pieces: ${missingText}.`,
    `Next step: ${nextBestStep}`,
    "Make the smallest useful change and explain how to test it."
  ].join("\n");
}
