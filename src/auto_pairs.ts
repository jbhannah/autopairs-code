'use strict';

import * as vscode from 'vscode';
import SpacerController from './spacer_controller';
import JumperController from './jumper_controller';

export default class AutoPairs {
    private config: vscode.WorkspaceConfiguration;
    private disposable: vscode.Disposable;
    private jumperController: JumperController | null = null;
    private spacerController: SpacerController | null = null;

    constructor() {
        let subscriptions: vscode.Disposable[] = [];
        vscode.workspace.onDidChangeConfiguration(this.onDidChangeConfiguration, this, subscriptions);

        const toggleAutoPairsCommand = vscode.commands.registerCommand('autopairs-code.toggleAutoPairs', this.toggleAutoPairs, this);
        subscriptions.push(toggleAutoPairsCommand);

        const toggleAutoPairsSpacingCommand = vscode.commands.registerCommand('autopairs-code.toggleAutoPairsSpacing', this.toggleAutoPairsSpacing, this);
        subscriptions.push(toggleAutoPairsSpacingCommand);

        this.disposable = vscode.Disposable.from(...subscriptions);

        this.config = this.getConfig();
    }

    dispose() {
        if (this.jumperController) { this.jumperController.dispose(); }
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

        if (config.get('enable', true) && !this.jumperController && config.get('jumping.enable', true)) {
            this.jumperController = new JumperController();
        } else if (this.jumperController && (!config.get('enable', true) || !config.get('jumping.enable', true))) {
            this.jumperController.dispose();
            this.jumperController = null;
        }

        return config;
    }

    private onDidChangeConfiguration() {
        this.config = this.getConfig();
    }

    private toggleAutoPairs() {
        this.config.update('enable', !this.config.get('enable', true), true);
    }

    private toggleAutoPairsSpacing() {
        this.config.update('spacing.enable', !this.config.get('spacing.enable', true), true);
    }
}
