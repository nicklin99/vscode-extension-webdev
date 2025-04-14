import * as os from "os";
import path from "path";
import * as fs from "fs";
import { exec } from "child_process";

// 项目管理curd
export const normalizePath = (input: string) => {
  if (input.startsWith("~")) {
    input = input.replace("~", os.homedir());
  }
  return path.normalize(input);
};

// 是否空目录
export function isEmpty(path: string) {
  const files = fs.readdirSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === ".git");
}

// 清空目录
export function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const file of fs.readdirSync(dir)) {
    if (file === ".git") {
      continue;
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
  }
}

export const now = () => {
  const dt = new Date();
  return dt.toISOString();
};

export const openOsFolder = (target: string) => {
  let command;
  switch (os.platform()) {
    case "win32": // Windows
      command = `explorer "${target}"`;
      break;
    case "darwin": // Mac
      command = `open "${target}"`;
      break;
    case "linux": // Linux
      command = `xdg-open "${target}"`;
      break;
    default:
      throw new Error("不支持的操作系统");
  }
  // 执行系统命令
  exec(command);
};
