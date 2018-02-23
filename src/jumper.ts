'use strict';

import * as vscode from 'vscode';

export default class Jumper {
    dispose() {}

    public tryJump(close: string): boolean {
        const editor = vscode.window.activeTextEditor;
        if (!editor || !editor.selection.isEmpty) { return false; }

        const position = editor.selection.active;
        const document = editor.document;

        const eof = document.lineAt(document.lineCount - 1).range.end;
        const range = new vscode.Range(position.translate(0, 1), eof);
        const text = document.getText(range);

        if (text.trim().indexOf(close) !== 0) { return false; }

        const editRange = new vscode.Range(position, position.translate(0, 1));
        editor.edit(edit => edit.replace(editRange, ""));

        const distance = text.replace("\n", "  ").indexOf(close) + 1;
        const start = document.offsetAt(position);
        const jumpTo = document.positionAt(start + distance);

        editor.selection = new vscode.Selection(jumpTo, jumpTo);

        return true;
    }
}
