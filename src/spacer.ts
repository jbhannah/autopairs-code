'use strict';

import * as vscode from 'vscode';

export default class Spacer {
    dispose () {}

    public shouldSpace([open, close]: vscode.CharacterPair, line: string, character: number): boolean {
        const textBefore = line.slice(Math.max(character - 1, 0), character + 1);
        if (textBefore !== `${open} `) { return false; }

        const textAfter = line.slice(character + 1, character + 2);
        if (textAfter !== close) { return false; }

        return true;
    }

    public shouldUnspace([open, close]: vscode.CharacterPair, line: string, character: number): boolean {
        const textBefore = line.slice(Math.max(character - 2, 0), Math.max(character - 1, 0));
        if (textBefore !== open) { return false; }

        const textAfter = line.slice(Math.max(character - 1, 0), character + 1);
        if (textAfter !== ` ${close}`) { return false; }

        return true;
    }

    public space(editor: vscode.TextEditor) {
        const position = editor.selection.active.translate(0, 1);
        const range = new vscode.Range(position, position);

        editor.edit(edit => edit.replace(range, ' '));
        editor.selection = new vscode.Selection(position, position);
    }

    public unspace(editor: vscode.TextEditor) {
        const position = editor.selection.active;
        const prevPosition = position.translate(0, -1);
        const range = new vscode.Range(prevPosition, position);

        editor.edit(edit => edit.delete(range));
        editor.selection = new vscode.Selection(prevPosition, prevPosition);
    }
}
