# vext-cli

[![Version](https://img.shields.io/npm/v/create-vext.svg)](https://www.npmjs.com/package/create-vext)[![License](https://img.shields.io/npm/l/create-vext.svg)](LICENSE) [English](README_EN.md) [简体中文](README.md)

` vext - cli ` is a used to quickly create and configure [vext](https://github.com/waahah/VExt)  command-line scaffolding toolsproject. It helps you easily initialize projects, configure project names, copy templates, and install dependencies, saving time and effort in the early stages of development.

## Feature

- ** Quick Project Creation ** : Quickly generate project skeletons from the command line
- ** Template Copy ** : Automatically copies the template file and modifies the configuration
- ** Dependency Management ** : Automatically detects the package manager (npm/yarn/pnpm) and silently installs dependencies
- ** Error rollback ** : Automatically clears residual files upon failure and provides error code classification
- ** Cross-platform support ** : Compatible with Windows/macOS/Linux systems

## Get started fast

### Install

Make sure you have [Node.js](https://nodejs.org/) (version 18 or later) and `npm` or `yarn` installed.

```bash
npm install -g create-vext
# Or use yarn
yarn global add create-vext
```

## How to use

Creating a new project with vext-cli is as simple as running the following command:

```bash
vext create <project-name> [options]
```

### Parameter description

- `<project-name>` : indicates the name of the project. Only lowercase letters, numbers, and hyphens (-) are allowed.
- `--force`: If the target directory already exists, it is forcibly cleared and overwritten.
- `--registry` : Specifies that the project depends on the image source

### Example

```bash
vext create my-awesome-project --force
vext create my-awesome-project --registry
```

## Error code system

`vext-cli` uses a set of predefined error codes to represent different error scenarios, making it easy to locate problems. Common error codes include:

- **1001 - INVALID_NAME** : The project name is invalid. Only lowercase letters, digits, and hyphens are allowed.
- **1002 -DIR_EXISTS ** : The target directory already exists.
- **1003 -templATE_missing ** : The template directory does not exist.
- **1004 -COPY_FAILED ** : File replication fails.
- **1005 -INSTALL_failed ** : Dependent installation fails.
- **1006 -CONFIG_FAILED ** : Project configuration modification fails.
- **1999 - UNKNOWN_ERROR** : unknown error.

## Debug mode

In DEBUG mode (setting the environment variable `DEBUG=true`), vext-cli will output more detailed error messages for developers to debug problems.

```bash
# Windows (PowerShell)
$env:DEBUG="1";  vext create test-project
# CMD
set DEBUG=1 && vext create test-project

# Linux/macOS
DEBUG=1 vext create test-project
```

When enabled, detailed error stack and context information is displayed

## Contribution

Welcome to contribute code, participate in project development, report bugs, or suggest features!

## License

The project is open source under the [MIT License](LICENSE).
