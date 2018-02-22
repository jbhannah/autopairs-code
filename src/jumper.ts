'use strict';

import * as vscode from 'vscode';
import { getPosition } from './util';

export default class Jumper {
    dispose() {}

    public tryJump(close: string): boolean {
        const position = getPosition();
        if (!position) { return false; }

        const editor = vscode.window.activeTextEditor;
        if (!editor) { return false; }

        const document = editor.document;
        const eof = document.lineAt(document.lineCount - 1).range.end;
        const range = new vscode.Range(position.translate(0, 1), eof);
        const text = document.getText(range);

        if (text.trim().indexOf(close) !== 0) { return false; }

        const editRange = new vscode.Range(position, position.translate(0, 1));
        editor.edit(edit => edit.replace(editRange, ''));

        const distance = text.indexOf(close) + 2; // distance in document text to character after close of matched pair
        const start = document.offsetAt(position);
        const jumpTo = document.positionAt(start + distance);

        editor.selection = new vscode.Selection(jumpTo, jumpTo);

        return true;
    }
}
