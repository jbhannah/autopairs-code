'use strict';

import * as vscode from 'vscode';
import { getPosition } from './util';

export default class Spacer {
    dispose () {}

    public trySpace(open: string, close: string, line: string): boolean {
        const position = getPosition();
        if (!position) { return false; }

        const textBefore = line.slice(Math.max(position.character - 1, 0), position.character + 1);
        if (textBefore !== `${open} `) { return false; }

        const textAfter = line.slice(position.character + 1, position.character + 2);
        if (textAfter !== close) { return false; }

        this.space(position);
        return true;
    }

    public tryUnspace(open: string, close: string, line: string): boolean {
        const position = getPosition();
        if (!position) { return false; }

        const textBefore = line.slice(Math.max(position.character - 2, 0), Math.max(position.character - 1, 0));
        if (textBefore !== open) { return false; }

        const textAfter = line.slice(Math.max(position.character - 1, 0), position.character + 1);
        if (textAfter !== ` ${close}`) { return false; }

        this.unspace(position);
        return true;
    }

    private setSelection(editor: vscode.TextEditor, line: number, position: number) {
        const newPosition = new vscode.Position(line, position);
        const newSelection = new vscode.Selection(newPosition, newPosition);
        editor.selection = newSelection;
    }

    private space(position: vscode.Position) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        const range = new vscode.Range(position.line, position.character + 1, position.line, position.character + 1);

        editor.edit(edit => edit.replace(range, " "));
        this.setSelection(editor, position.line, position.character + 1);
    }

    private unspace(position: vscode.Position) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        const range = new vscode.Range(position.line, position.character - 1, position.line, position.character);

        editor.edit(edit => edit.replace(range, ""));
        this.setSelection(editor, position.line, position.character - 1);
    }
}
