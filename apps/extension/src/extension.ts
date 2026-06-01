import * as vscode from "vscode";
import { getContextSummary, scanProjectContext } from "./context";

export function activate(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand("heyMicki.sendContext", async () => {
    try {
      const projectContext = await scanProjectContext();
      const summary = getContextSummary(projectContext);

      console.log("hey-micki scanned context summary:", summary);

      await vscode.window.showInformationMessage(
        `Scanned ${summary.workspaceName}: ${summary.fileCount} files found.`
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to scan project context.";
      await vscode.window.showErrorMessage(message);
    }
  });

  context.subscriptions.push(command);
}

export function deactivate() {}
