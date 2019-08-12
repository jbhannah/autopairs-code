'use strict';

import * as vscode from 'vscode';
import JumperController from './jumper_controller';
import SpacerController from './spacer_controller';

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

        const toggleAutoPairsJumpingCommand = vscode.commands.registerCommand('autopairs-code.toggleAutoPairsJumping', this.toggleAutoPairsJumping, this);
        subscriptions.push(toggleAutoPairsJumpingCommand);

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

    private showStatusMessage(message: string) {
        vscode.window.setStatusBarMessage(`AutoPairs: ${message}`, 2000);
    }

    private toggleAutoPairs() {
        const newValue = this.toggleConfig('enable');
        const message = newValue ? 'enabled' : 'disabled';
        this.showStatusMessage(`Extension ${message}`);
    }

    private toggleAutoPairsJumping() {
        const newValue = this.toggleConfig('jumping.enable');
        const message = newValue ? 'enabled' : 'disabled';
        this.showStatusMessage(`Jumping ${message}`);
    }

    private toggleAutoPairsSpacing() {
        const newValue = this.toggleConfig('spacing.enable');
        const message = newValue ? 'enabled' : 'disabled';
        this.showStatusMessage(`Spacing ${message}`);
    }

    private toggleConfig(section: string): boolean {
        const newValue = !this.config.get(section, true);
        this.config.update(section, newValue, true);
        return newValue;
    }
}
