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

    public space({ selection, edit }: vscode.TextEditor) {
        const position = selection.active.translate(0, 1);
        const range = new vscode.Range(position, position);

        edit(e => e.replace(range, ' '));
        selection = new vscode.Selection(position, position);
    }

    public unspace({ selection, edit }: vscode.TextEditor) {
        const position = selection.active;
        const prevPosition = position.translate(0, -1);
        const range = new vscode.Range(prevPosition, position);

        edit(e => e.delete(range));
        selection = new vscode.Selection(prevPosition, prevPosition);
    }
}
