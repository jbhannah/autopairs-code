'use strict';

import * as vscode from 'vscode';

export default interface Handler {
    configSectionName: string;

    considerHandling({ pair, change, }: { pair: vscode.CharacterPair; change: vscode.TextDocumentChangeEvent; }): void;
    dispose(): void;
}
