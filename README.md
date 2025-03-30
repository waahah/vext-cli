# vext-cli

[![Version](https://img.shields.io/npm/v/vext-cli.svg)](https://www.npmjs.com/package/vext-cli)[![License](https://img.shields.io/npm/l/vext-cli.svg)](LICENSE) [English](README_EN.md) [简体中文](README.md)

`vext-cli` 是一个用于快速创建和配置 [Vext](https://github.com/waahah/VExt) 项目的命令行脚手架工具。它可以帮助你轻松地初始化项目、配置项目名称、复制模板并安装依赖，节省开发初期的时间和精力。

## 特性

- **快速创建项目**：通过命令行快速生成项目骨架
- **模板复制**：自动复制模板文件并修改配置
- **依赖管理**：自动检测包管理器（npm/yarn/pnpm）并静默安装依赖
- **错误回滚**：失败时自动清理残留文件，提供错误码分类
- **跨平台支持**：兼容 Windows/macOS/Linux 系统

## 快速开始

### 安装

确保你已经安装 [Node.js](https://nodejs.org/)（版本 18 或以上）以及 `npm` 或 `yarn`。
```bash
npm install -g vext-cli
# 或者使用 yarn
yarn global add vext-cli
```

## 使用方法
使用 vext-cli 创建一个新的项目非常简单，只需运行以下命令：

```bash
vext create <project-name> [options]
```
### 参数说明
- `<project-name>`：项目名称，仅允许使用小写字母、数字和连字符(-)。
- `--force`：如果目标目录已存在，强制清除并覆盖。
- `--registry`：指定项目依赖镜像源

### 示例

```bash
vext create my-awesome-project --force
vext create my-awesome-project --registry
```

## 错误码体系
`vext-cli` 使用一套预定义的错误码来表示不同的错误场景，便于定位问题。常见错误码包括：

- **1001 - INVALID_NAME**：项目名称不合法（只允许小写字母、数字和连字符）。
- **1002 - DIR_EXISTS**：目标目录已存在。
- **1003 - TEMPLATE_MISSING**：模板目录不存在。
- **1004 - COPY_FAILED**：文件复制失败。
- **1005 - INSTALL_FAILED**：依赖安装失败。
- **1006 - CONFIG_FAILED**：项目配置修改失败。
- **1999 - UNKNOWN_ERROR**：未知错误。

## 调试模式
在调试模式下（设置环境变量 `DEBUG=true`），vext-cli 会输出更详细的错误信息，方便开发者调试问题。
```bash
# Windows (PowerShell)
$env:DEBUG="1"; vext create test-project
# CMD
set DEBUG=1 && vext create test-project

# Linux/macOS
DEBUG=1 vext create test-project
```

启用后将显示详细错误堆栈和上下文信息

## 贡献
欢迎贡献代码、参与项目开发、报告 bug 或提出功能建议！

## 许可证
该项目采用 [MIT License](LICENSE) 开源许可。