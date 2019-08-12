'use strict';

import * as vscode from 'vscode';
import { PAIRS } from './pairs';
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

    private considerSpacingFor({ pair, change }: { pair: vscode.CharacterPair; change: string; }) {
        const editor = vscode.window.activeTextEditor;
        if (!editor || !editor.selection.isEmpty) { return; }

        const position = editor.selection.active;
        const line = editor.document.lineAt(position.line).text;

        if (change === '' && this.spacer.shouldUnspace(pair, line, position.character)) {
            this.spacer.unspace(editor);
        } else if (change === ' ' && this.spacer.shouldSpace(pair, line, position.character)) {
            this.spacer.space(editor);
        }
    }

    private getConfig(): vscode.WorkspaceConfiguration {
        return vscode.workspace.getConfiguration('autopairs-code.spacing');
    }

    private onDidChangeConfiguration() {
        this.config = this.getConfig();
    }

    private onDidChangeTextDocument({ contentChanges }: vscode.TextDocumentChangeEvent) {
        if (!this.config.get('enable', true)) { return; }
        if (contentChanges.length !== 1) { return; }

        const change = contentChanges[0].text;

        if (this.config.get('enableForBraces', true)) {
            this.considerSpacingFor({ pair: PAIRS.BRACES, change });
        }

        if (this.config.get('enableForBrackets', true)) {
            this.considerSpacingFor({ pair: PAIRS.BRACKETS, change });
        }

        if (this.config.get('enableForParentheses', true)) {
            this.considerSpacingFor({ pair: PAIRS.PARENTHESES, change });
        }
    }
}
