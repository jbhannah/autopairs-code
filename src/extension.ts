'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import SpacerController from './spacer_controller';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const spacerControlller = new SpacerController();
    context.subscriptions.push(spacerControlller);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
