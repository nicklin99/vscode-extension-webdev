import * as vscode from 'vscode';
import { ProjectManager } from "./cmd/project";

let logger: vscode.OutputChannel
export function activate(context: vscode.ExtensionContext) {
    // 创建日志通道
    logger = vscode.window.createOutputChannel("项目管理");
    logger.appendLine(`[INFO] 欢迎使用项目管理小插件`);
    logger.appendLine(`[INFO] 打开命令,输入web,找到web小助手:项目管理进入`);
    // 注册命令
    let disposable = vscode.commands.registerCommand('webagent.project', () => {
        const cmd = new ProjectManager(context, logger);
        cmd.createWebview();
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    console.log('插件已停用');
    logger.dispose()
}