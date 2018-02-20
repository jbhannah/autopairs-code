'use strict';

import * as vscode from 'vscode';

export function getPosition(): vscode.Position | undefined {
    if (!vscode.window.activeTextEditor) { return undefined; }
    return vscode.window.activeTextEditor.selection.active;
}
