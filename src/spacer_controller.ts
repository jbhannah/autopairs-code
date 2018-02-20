'use strict';

import * as vscode from 'vscode';
import Spacer from './spacer';

export default class SpacerController {
    private config: vscode.WorkspaceConfiguration;
    private disposable: vscode.Disposable;
    private spacer: Spacer;

    constructor() {
        let subscriptions: vscode.Disposable[] = [];

        this.spacer = new Spacer();
        subscriptions.push(this.spacer);

        vscode.workspace.onDidChangeConfiguration(this.onDidChangeConfiguration, this, subscriptions);
        vscode.workspace.onDidChangeTextDocument(this.onDidChangeTextDocument, this, subscriptions);

        this.config = this.getConfig();
        this.disposable = vscode.Disposable.from(...subscriptions);
    }

    dispose() {
        this.disposable.dispose();
    }

    private considerSpacingFor(open: string, close: string, line: string) {
        return this.spacer.trySpace(open, close, line) || this.spacer.tryUnspace(open, close, line);
    }

    private getConfig(): vscode.WorkspaceConfiguration {
        return vscode.workspace.getConfiguration('autopairs-code.spacing');
    }

    private onDidChangeConfiguration() {
        this.config = this.getConfig();
    }

    private onDidChangeTextDocument(e: vscode.TextDocumentChangeEvent) {
        if (!this.config.get('enable', true)) { return; }

        if (e.contentChanges.length < 1) { return; }

        const change = e.contentChanges[0];
        if (change.text !== '' && change.text !== ' ') { return; }

        const editor = vscode.window.activeTextEditor;
        if (!editor || !editor.selection.isEmpty) { return; }

        const position = editor.selection.active;
        const line = editor.document.lineAt(position.line).text;

        if (this.config.get('enableForBraces', true)) {
            this.considerSpacingFor('{', '}', line);
        }

        if (this.config.get('enableForBrackets', true)) {
            this.considerSpacingFor('[', ']', line);
        }

        if (this.config.get('enableForParentheses', true)) {
            this.considerSpacingFor('(', ')', line);
        }
    }
}
