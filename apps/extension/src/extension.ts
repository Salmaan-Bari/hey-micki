import * as vscode from "vscode";
import { sendContextToDesktop } from "./client";
import { getContextSummary, scanProjectContext } from "./context";

const AUTO_REFRESH_DEBOUNCE_MS = 1500;
const MIN_BACKGROUND_REFRESH_INTERVAL_MS = 5000;

let autoRefreshTimer: NodeJS.Timeout | undefined;
let lastBackgroundRefreshAt = 0;

export function activate(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand("heyMicki.sendContext", async () => {
    try {
      const { response, summary } = await refreshContext("manual");

      await vscode.window.showInformationMessage(buildSuccessMessage(response.message, summary));
    } catch (error) {
      console.error("hey-micki failed to send context:", error);
      const message = error instanceof Error ? error.message : "Unable to send project context to Micki.";
      await vscode.window.showErrorMessage(message);
    }
  });

  const saveListener = vscode.workspace.onDidSaveTextDocument((document) => {
    if (!hasWorkspace(document)) {
      return;
    }

    scheduleBackgroundRefresh();
  });

  context.subscriptions.push(command, saveListener);
}

export function deactivate() {
  if (autoRefreshTimer) {
    clearTimeout(autoRefreshTimer);
  }
}

async function refreshContext(reason: "manual" | "save") {
  console.log("hey-micki context scan started:", { reason });

  const projectContext = await scanProjectContext();
  const summary = getContextSummary(projectContext);

  console.log("hey-micki context scan completed:", summary);
  const response = await sendContextToDesktop(projectContext);

  console.log("hey-micki context sent to desktop app:", {
    reason,
    workspaceName: summary.workspaceName,
    fileCount: summary.fileCount,
    activeFile: summary.currentFile
  });

  return { response, summary };
}

function scheduleBackgroundRefresh() {
  if (autoRefreshTimer) {
    clearTimeout(autoRefreshTimer);
  }

  autoRefreshTimer = setTimeout(async () => {
    const now = Date.now();

    if (now - lastBackgroundRefreshAt < MIN_BACKGROUND_REFRESH_INTERVAL_MS) {
      console.log("hey-micki skipped save refresh to avoid sending too often.");
      return;
    }

    lastBackgroundRefreshAt = now;

    try {
      await refreshContext("save");
    } catch (error) {
      console.error("hey-micki background context refresh failed:", error);
    }
  }, AUTO_REFRESH_DEBOUNCE_MS);
}

function hasWorkspace(document: vscode.TextDocument) {
  return Boolean(vscode.workspace.workspaceFolders?.length && vscode.workspace.getWorkspaceFolder(document.uri));
}

function buildSuccessMessage(
  desktopMessage: string | undefined,
  summary: ReturnType<typeof getContextSummary>
) {
  const activeFileText = summary.currentFileName ? ` Active file: ${summary.currentFileName}.` : " No active file.";

  return `${desktopMessage ?? "Context sent to Micki"} for ${summary.workspaceName}: ${summary.fileCount} files.${activeFileText}`;
}
