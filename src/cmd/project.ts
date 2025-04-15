import * as vscode from "vscode";
import * as path from "path";
import { ChildProcess, exec } from "child_process";
import * as fs from "fs";
import { emptyDir, isEmpty, normalizePath, now, openOsFolder } from "./utils";
import { ProjectData } from "../types";
import * as os from "os";
import { ProjectCommand } from "../config";

type CreateProjectMsg = {
  command: string;
  name: string;
  path: string;
  ts: boolean;
  template?: string;
  cwd?: string;
};

function getAssetsUri(
  context: vscode.ExtensionContext,
  filename: string
): vscode.Uri {
  const scriptPath = path.join(context.extensionPath, "out", filename);
  return vscode.Uri.file(scriptPath);
}

export class ProjectManager {
  controller?: AbortController
  PROJECTS_FILE_PATH = path.join(os.homedir(), ".vscode_created_projects.json");

  private panel: vscode.WebviewPanel | undefined;

  constructor(private context: vscode.ExtensionContext, private logger: vscode.OutputChannel) {}

  public createWebview(): void {
    if (this.panel) {
      this.panel.reveal(vscode.ViewColumn.One);
      return;
    }

    this.panel = vscode.window.createWebviewPanel(
      "seafront.projectManager",
      "项目管理",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        enableFindWidget: true,
      }
    );
    this.panel.webview.onDidReceiveMessage(
      (message) => {
        if (message.command === ProjectCommand.Cli) {
          this.runCliCommand(message.payload);
        } else if (message.command === ProjectCommand.ListProjects) {
          const projects = this.readProjects();
          this.panel!.webview.postMessage({
            command: ProjectCommand.ListProjects,
            payload: projects,
          });
        } else if (message.command === ProjectCommand.Cancel) {
          // 取消
          this.controller?.abort()
          this.notifyWeb(ProjectCommand.Cancel)
        } else if (message.command === ProjectCommand.OpenProject) {
          vscode.commands.executeCommand(
            "vscode.openFolder",
            vscode.Uri.file(message.payload.target),
            false // 是否在新窗口（true）或当前窗口（false）中打开文件夹。
          );
        } else if (message.command === ProjectCommand.OpenOSFolder) {
          openOsFolder(message.payload.target)
        }  else if (message.command === ProjectCommand.UpdateTitle) {
          this.panel!.title = message.payload.title
        }
      },
      undefined,
      this.context.subscriptions
    );

    this.panel.webview.html = this.getWebviewContent(
      this.panel.webview.asWebviewUri(
        getAssetsUri(this.context, "webviews/project/index.js")
      ),
      this.panel.webview.asWebviewUri(
        getAssetsUri(this.context, "webviews/project/index.css")
      )
    );

    this.panel.onDidDispose(() => {
      this.panel = undefined;
    });
  }

  public createProjectView(): void {
    this.createWebview();
    this.panel!.webview.postMessage({
      command: ProjectCommand.CreateProject,
    })
  }

  private getWebviewContent(script: vscode.Uri, css: vscode.Uri): string {
    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title></title>
                <link rel="stylesheet" crossorigin href="${css}">
                <script type="module" crossorigin src="${script}"></script>
            </head>
            <body>
                <div id="app">app</div>
            </body>
            </html>
        `;
  }

  private runCliCommand(props: CreateProjectMsg): void {
    const {
      name,
    } = props
    const exists = this.readProjects()
    const exist = exists.some((item) => {
      if (item.name === name) {
        return true
      }
      return false
    })
    if (exist) {
      // confirm是否要继续创建
      vscode.window
      .showWarningMessage(
        `项目已存在: ${name}，是否继续创建？`,
        { modal: true }, // 模态对话框
        "继续创建",
      )
      .then((selection) => {
        if (selection === "继续创建") {
          this.createProject(props);
        } else {
          this.notifyWeb(ProjectCommand.Cancel)
        }
      });
      return;
    }
    this.createProject(props);
  }

  async createProject(props: CreateProjectMsg){
    const {
      command,
      name,
      path: pathanme,
      ts,
      template,
      cwd
    } = props
    const targetDir = normalizePath(pathanme);
    if (!fs.existsSync(targetDir)) {
      // 创建目录
      try {
        fs.mkdirSync(targetDir, { recursive: true }); // 递归创建目录
        vscode.window.showInformationMessage(`目录已创建: ${targetDir}`);
      } catch (error) {
        vscode.window.showErrorMessage(`创建目录失败: ${error}`);
        return;
      }
    } else {
      // 是否空目录
      if (!isEmpty(targetDir)) {
        const ret = await vscode.window
        .showWarningMessage(
          `非空目录: ${targetDir}，是否删除重新创建？`,
          { modal: true }, // 模态对话框
          "确认",
        )
        if (ret === "确认") {
          emptyDir(targetDir)
        } else {
          this.notifyWeb(ProjectCommand.Cancel)
          return
        }
      }
    }
    this.logger.appendLine(command)
    const dirname = path.basename(targetDir)
    const cwdValue = cwd ? normalizePath(cwd) : path.dirname(targetDir)
    this.controller = new AbortController();
    const { signal } = this.controller;
    const cmd = exec(
      `${command}`,
      { cwd: cwdValue, signal },
      (error, stdout, stderr) => {
        // 存储已创建的项目到文件
        this.insertProject({
          name,
          target: targetDir,
          cwd: cwdValue,
          command,
          dirname,
          template,
          ts,
        });
        if (error) {
          this.logger.appendLine(`[ERROR] ${error}`)
          return;
        }
        if (stdout) {
          this.logger.appendLine(`[INFO] ${stdout}`)
        }
        if (stderr) {
          this.logger.appendLine(`[ERROR] ${stderr}`)
        }
        vscode.window.showInformationMessage(`执行成功`);
        // 通知 Webview 执行成功
        if (this.panel) {
          this.notifyWeb(ProjectCommand.Cancel)
        }
        /**
         * 打开新创建的项目
         * 执行打开新工作区
         */
        vscode.commands.executeCommand(
          "vscode.openFolder",
          vscode.Uri.file(targetDir),
          false // 是否在新窗口（true）或当前窗口（false）中打开文件夹。
        );
      }
    );
  }

  // ==========================
  // 项目文件操作逻辑
  // ==========================
  readProjects(): ProjectData[] {
    if (fs.existsSync(this.PROJECTS_FILE_PATH)) {
      try {
        const data = fs.readFileSync(this.PROJECTS_FILE_PATH, "utf-8");
        return JSON.parse(data) as ProjectData[];
      } catch (error) {
        console.error("读取项目文件失败:", error);
        return [];
      }
    }
    return [];
  }

  /**
   * 
   * @param newProject 新项目数据
   * @param upsert 是否更新已存在的项目
   */
  insertProject(newProject: ProjectData, upsert = true) {
    // 存储已创建的项目到文件
    let projects = this.readProjects();
    if (upsert) {
      if (this.existProjectName(projects, newProject.name)) {
        projects = projects.map(item => {
          if (item.name === newProject.name) {
            newProject.createdAt = item.createdAt || now()
            newProject.updatedAt = now()
            return newProject;
          } else {
            return item
          }
        })
      } else {
        newProject.createdAt = now()
        projects.unshift(newProject);
      }
    } else {
      projects.unshift(newProject);
    }
    this.writeProjects(projects);
  }

  existProjectName(projects: ProjectData[],name: string) {
    return projects.some((item) => {
      if (item.name === name) {
        return true;
      }
      return false;
    });
  }

  // 写入项目列表到文件
  private writeProjects(projects: ProjectData[]): boolean {
    try {
      fs.writeFileSync(
        this.PROJECTS_FILE_PATH,
        JSON.stringify(projects, null, 2),
        "utf-8"
      );
      return true;
    } catch (error) {
      console.error("写入项目文件失败:", error);
      return false;
    }
  }

  notifyWeb(type: ProjectCommand) {
    this.panel!.webview.postMessage({
      command: type,
    });
  }
}
