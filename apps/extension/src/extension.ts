import * as vscode from "vscode";
import { sendContextToDesktop } from "./client";
import { getContextSummary, scanProjectContext } from "./context";

export function activate(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand("heyMicki.sendContext", async () => {
    try {
      const projectContext = await scanProjectContext();
      const summary = getContextSummary(projectContext);

      console.log("hey-micki scanned context summary:", summary);
      const response = await sendContextToDesktop(projectContext);

      await vscode.window.showInformationMessage(
        `${response.message ?? "Context sent to Micki"}: ${summary.workspaceName} (${summary.fileCount} files).`
      );
    } catch (error) {
      console.error("hey-micki failed to send context:", error);
      const message = error instanceof Error ? error.message : "Unable to send project context to Micki.";
      await vscode.window.showErrorMessage(message);
    }
  });

  context.subscriptions.push(command);
}

export function deactivate() {}
