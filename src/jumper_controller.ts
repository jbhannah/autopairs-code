'use strict';

import * as vscode from 'vscode';
import Jumper from './jumper';
import { PAIRS } from './pairs';

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
        if (e.contentChanges.length < 1) { return; }
        if (e.contentChanges.length > 1 && e.contentChanges[0].rangeLength !== 1) { return; }

        const close = e.contentChanges[0].text;

        if (
            (
                (close === PAIRS.BRACES[1]      && this.config.get('enableForBraces', true)) ||
                (close === PAIRS.BRACKETS[1]    && this.config.get('enableForBrackets', true)) ||
                (close === PAIRS.PARENTHESES[1] && this.config.get('enableForParentheses', true))
            ) &&
            this.jumper.anyUnmatchedClose(e.document, close)
        ) {
            this.jumper.tryJump(close);
        }
    }
}
