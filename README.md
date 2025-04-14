# vscode前端项目管理

## 项目简介
这是一个 Visual Studio Code 插件项目，旨在提供一些自定义功能以增强开发体验。

## 功能
该插件提供以下功能：
- 插件激活时的初始化功能
- 自定义命令的实现
- 资源的清理功能

## 文件结构
```
vscode-extension-project
├── src
│   ├── extension.ts        # 插件的入口点
│   └── types
│       └── index.ts       # 类型和接口定义
├── .vscode
│   └── launch.json         # 调试配置
├── package.json            # npm 配置文件
├── tsconfig.json           # TypeScript 配置文件
├── webpack.config.js       # Webpack 配置文件
└── README.md               # 项目文档
```

## 安装
1. 克隆该项目到本地：
   ```
   git clone <repository-url>
   ```
2. 进入项目目录：
   ```
   cd vscode-extension-project
   ```
3. 安装依赖：
   ```
   npm install
   ```

## 使用
1. 在 Visual Studio Code 中打开该项目。
2. 按 `F5` 启动调试，运行插件。
3. 使用插件提供的命令。

## 开发

`npm run dev`

## 贡献
欢迎提交问题和请求功能，或直接提交代码贡献。

## 许可证
该项目遵循 MIT 许可证。