'use strict';

import * as vscode from 'vscode';
import { PAIRS_BY_CLOSE } from './pairs';

export default class Jumper {
    dispose() {}

    public anyUnmatchedClose({ document, close }: { document: vscode.TextDocument; close: string; }): boolean {
        const open = PAIRS_BY_CLOSE[close][0];
        const text = document.getText();
        let count = 0;

        for (let i = 0; i < text.length; i++) {
            if (text[i] === open) {
                count--;
            } else if (text[i] === close) {
                count++;
            }
        }

        return count > 0;
    }

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
        editor.edit(edit => edit.delete(editRange));

        const distance = text.replace('\n', '  ').indexOf(close) + 1;
        const start = document.offsetAt(position);
        const jumpTo = document.positionAt(start + distance);

        editor.selection = new vscode.Selection(jumpTo, jumpTo);

        return true;
    }
}
