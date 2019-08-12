'use strict';

import * as vscode from 'vscode';
import Handler from './handler';

export default class Spacer implements Handler {
    configSectionName = 'spacing';

    dispose () {}

    public considerHandling({ pair, change }: { pair: vscode.CharacterPair; change: vscode.TextDocumentChangeEvent; }) {
        const editor = vscode.window.activeTextEditor;
        if (!editor || !editor.selection.isEmpty) { return; }

        const position = editor.selection.active;
        const line = editor.document.lineAt(position.line).text;
        const text = change.contentChanges[0].text;

        if (text === '' && this.shouldUnspace(pair, line, position.character)) {
            this.unspace(editor);
        } else if (text === ' ' && this.shouldSpace(pair, line, position.character)) {
            this.space(editor);
        }
    }

    private shouldSpace([open, close]: vscode.CharacterPair, line: string, character: number): boolean {
        const textBefore = line.slice(Math.max(character - 1, 0), character + 1);
        if (textBefore !== `${open} `) { return false; }

        const textAfter = line.slice(character + 1, character + 2);
        if (textAfter !== close) { return false; }

        return true;
    }

    private shouldUnspace([open, close]: vscode.CharacterPair, line: string, character: number): boolean {
        const textBefore = line.slice(Math.max(character - 2, 0), Math.max(character - 1, 0));
        if (textBefore !== open) { return false; }

        const textAfter = line.slice(Math.max(character - 1, 0), character + 1);
        if (textAfter !== ` ${close}`) { return false; }

        return true;
    }

    private space(editor: vscode.TextEditor) {
        const position = editor.selection.active.translate(0, 1);
        const range = new vscode.Range(position, position);

        editor.edit(e => e.replace(range, ' '));
        editor.selection = new vscode.Selection(position, position);
    }

    private unspace(editor: vscode.TextEditor) {
        const position = editor.selection.active;
        const prevPosition = position.translate(0, -1);
        const range = new vscode.Range(prevPosition, position);

        editor.edit(e => e.delete(range));
        editor.selection = new vscode.Selection(prevPosition, prevPosition);
    }
}
