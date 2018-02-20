'use strict';

import * as vscode from 'vscode';

export function getPosition(): vscode.Position | undefined {
    if (!vscode.window.activeTextEditor) { return undefined; }
    return vscode.window.activeTextEditor.selection.active;
}

export function setSelection(editor: vscode.TextEditor, line: number, position: number) {
    const newPosition = new vscode.Position(line, position);
    const newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;
}
