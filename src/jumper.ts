'use strict';

import * as vscode from 'vscode';
import Handler from './handler';
import { PAIRS_BY_CLOSE } from './pairs';

export default class Jumper implements Handler {
    configSectionName = 'jumping';

    dispose() {}

    public considerHandling({ pair, change }: { pair: vscode.CharacterPair; change: vscode.TextDocumentChangeEvent; }) {
        const { document, contentChanges: [{ text: closeRaw, range: closeRange }] } = change;
        const close = closeRaw.trim();

        if (close === pair[1] && this.anyUnmatchedClose({ document, close })) {
            this.tryJump(close, closeRange);
        }
    }

    private anyUnmatchedClose({ document, close }: { document: vscode.TextDocument; close: string; }): boolean {
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

    public async tryJump(close: string, closeRange: vscode.Range): Promise<boolean> {
        const editor = vscode.window.activeTextEditor;
        if (!editor || !editor.selection.isEmpty) { return false; }

        const document = editor.document;

        const lineRange = document.lineAt(closeRange.end.line).range;
        const line = document.getText(lineRange);
        const emptyLine = line.trim() === close;

        let position = editor.selection.active;
        if (emptyLine) {
            position = new vscode.Position(position.line, line.length-1);
        }

        const eof = document.lineAt(document.lineCount - 1).range.end;
        const range = new vscode.Range(position.translate(0, 1), eof);
        const restOfFile = document.getText(range);

        if (restOfFile.trim().indexOf(close) !== 0) { return false; }

        const distance = restOfFile.replace('\n', ' ').indexOf(close) + 2;
        const start = document.offsetAt(position);
        const jumpTo = document.positionAt(start + distance);

        editor.selection = new vscode.Selection(jumpTo, jumpTo);

        const deleteStart = (emptyLine) ? document.lineAt(closeRange.end.line-1).range.end : closeRange.start;
        const editRange = new vscode.Range(deleteStart, closeRange.end.translate(0, 1));
        await editor.edit(edit => edit.delete(editRange));

        return true;
    }
}
