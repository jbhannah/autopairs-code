'use strict';

import * as vscode from 'vscode';
import Jumper from './jumper';

export default class JumperController {
    private config: vscode.WorkspaceConfiguration;
    private disposable: vscode.Disposable;
    private jumper: Jumper;

    constructor() {
        let subscriptions: vscode.Disposable[] = [];

        this.jumper = new Jumper();
        subscriptions.push(this.jumper);

        vscode.workspace.onDidChangeConfiguration(this.onDidChangeConfiguration, this, subscriptions);
        vscode.workspace.onDidChangeTextDocument(this.onDidChangeTextDocument, this, subscriptions);

        this.config = this.getConfig();
        this.disposable = vscode.Disposable.from(...subscriptions);
    }

    dispose() {
        this.disposable.dispose();
    }

    private getConfig(): vscode.WorkspaceConfiguration {
        return vscode.workspace.getConfiguration('autopairs-code.jumping');
    }

    private onDidChangeConfiguration() {
        this.config = this.getConfig();
    }

    private onDidChangeTextDocument(e: vscode.TextDocumentChangeEvent) {
        if (!this.config.get('enable', true)) { return; }
        if (e.contentChanges.length !== 1) { return; }

        const change = e.contentChanges[0];
        const close = change.text;

        if (
            (close === '}' && this.config.get('enableForBraces', true)) ||
            (close === ']' && this.config.get('enableForBrackets', true)) ||
            (close === ')' && this.config.get('enableForParentheses', true))
        ) {
            this.jumper.tryJump(close);
        }
    }
}
