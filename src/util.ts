'use strict';

import * as vscode from 'vscode';

export function getPosition(): vscode.Position | undefined {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return undefined; }
    return editor.selection.active;
}

export function setSelection(editor: vscode.TextEditor, line: number, position: number) {
    const newPosition = new vscode.Position(line, position);
    const newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;
}
