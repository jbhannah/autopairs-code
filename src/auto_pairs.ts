'use strict';

import * as vscode from 'vscode';
import SpacerController from './spacer_controller';

export default class AutoPairs {
    private disposable: vscode.Disposable;
    private spacerController: SpacerController | null = null;

    constructor() {
        let subscriptions: vscode.Disposable[] = [];
        vscode.workspace.onDidChangeConfiguration(this.onDidChangeConfiguration, this, subscriptions);
        this.disposable = vscode.Disposable.from(...subscriptions);

        this.getConfig();
    }

    dispose() {
        if (this.spacerController) { this.spacerController.dispose(); }
        this.disposable.dispose();
    }

    private getConfig(): vscode.WorkspaceConfiguration {
        const config = vscode.workspace.getConfiguration('autopairs-code');

        if (config.get('enable', true) && !this.spacerController && config.get('spacing.enable', true)) {
            this.spacerController = new SpacerController();
        } else if (this.spacerController && (!config.get('enable', true) || !config.get('spacing.enable', true))) {
            this.spacerController.dispose();
            this.spacerController = null;
        }

        return config;
    }

    private onDidChangeConfiguration() {
        this.getConfig();
    }
}
