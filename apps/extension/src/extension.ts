import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand("heyMicki.sendContext", () => {
    void vscode.window.showInformationMessage("hey-micki extension is running.");
  });

  context.subscriptions.push(command);
}

export function deactivate() {}
