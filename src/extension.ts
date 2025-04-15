import * as vscode from 'vscode';
import { ProjectManager } from "./cmd/project";

let logger: vscode.OutputChannel
export function activate(context: vscode.ExtensionContext) {
    // 创建日志通道
    logger = vscode.window.createOutputChannel("项目管理");
    logger.appendLine(`[INFO] 欢迎使用项目管理小插件`);
    logger.appendLine(`[INFO] 打开命令,输入Web,找到Web开发:项目管理进入`);
    // 注册命令
    const cmd = new ProjectManager(context, logger);
    let disposable = vscode.commands.registerCommand('seafront.project', () => {
        cmd.createWebview();
    });

    context.subscriptions.push(disposable);

    let disposable_create = vscode.commands.registerCommand('seafront.project/create', () => {
        cmd.createProjectView();
    });

    context.subscriptions.push(disposable_create);
}

export function deactivate() {
    console.log('插件已停用');
    logger.dispose()
}