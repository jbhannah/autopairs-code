'use strict';

import * as vscode from 'vscode';

export const BRACES: vscode.CharacterPair = ['{', '}'];
const BRACKETS: vscode.CharacterPair = ['[', ']'];
const PARENTHESES: vscode.CharacterPair = ['(', ')'];

export const PAIRS: { [key: string]: vscode.CharacterPair } = {
    'BRACES': BRACES,
    'BRACKETS': BRACKETS,
    'PARENTHESES': PARENTHESES
};

export const PAIRS_BY_OPEN: { [key: string]: vscode.CharacterPair } = {
    '{': BRACES,
    '[': BRACKETS,
    '(': PARENTHESES
};

export const PAIRS_BY_CLOSE: { [key: string]: vscode.CharacterPair } = {
    '}': BRACES,
    ']': BRACKETS,
    ')': PARENTHESES
};
