#!/usr/bin/env node

import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import replaceFile from 'replace-in-file';
import { fileURLToPath } from 'url';
import { execa } from 'execa';

// ================ Initialization ================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename).replace(/\\/g, '/');

// ================ Error Codes ================
const ErrorCodes = {
  INVALID_NAME: 1001,
  DIR_EXISTS: 1002,
  TEMPLATE_MISSING: 1003,
  COPY_FAILED: 1004,
  INSTALL_FAILED: 1005,
  CONFIG_FAILED: 1006,
  UNKNOWN_ERROR: 1999
};

class CliError extends Error {
  constructor(message, code, context = {}) {
    super(message);
    this.name = "CLI Error";
    this.code = code;
    this.context = context;
  }
}

// ================ Core Functions ================
const detectPackageManager = (targetDir) => {
  const lockFiles = {
    'yarn.lock': 'yarn',
    'pnpm-lock.yaml': 'pnpm',
    'package-lock.json': 'npm'
  };

  for (const [file, manager] of Object.entries(lockFiles)) {
    if (fs.existsSync(path.join(targetDir, file))) return manager;
  }

  try {
    execa.sync('yarn', ['--version'], { stdio: 'ignore' });
    return 'yarn';
  } catch {
    return 'npm';
  }
};

// ================ Project Creation Logic ================
program
  .name('vext')
  .version('1.0.0')
  .description('Vext Project Scaffolding Tool')
  .command('create <project-name>')
  .description('Create a new project')
  .option('-f, --force', 'Force overwrite existing directory')
  .action(async (projectName, options) => {
    let targetDir;
    try {
      // Validate project name
      if (!/^[a-z0-9-]+$/.test(projectName)) {
        throw new CliError(
          'Project name can only contain lowercase letters, numbers, and hyphens (-)',
          ErrorCodes.INVALID_NAME
        );
      }

      // Initialize paths
      targetDir = path.resolve(process.cwd(), projectName).replace(/\\/g, '/');
      const templatePath = path.join(__dirname, '../template').replace(/\\/g, '/');

      // Force overwrite logic
      if (options.force && fs.existsSync(targetDir)) {
        await fs.remove(targetDir);
        console.log(chalk.yellow(`♻️  Forcefully cleaned directory: ${targetDir}`));
      }

      // Path validation
      if (fs.existsSync(targetDir)) {
        throw new CliError(
          `Target directory ${chalk.cyan(targetDir)} already exists`,
          ErrorCodes.DIR_EXISTS,
          { targetDir }
        );
      }

      if (!fs.existsSync(templatePath)) {
        throw new CliError(
          `Template directory ${chalk.cyan(templatePath)} does not exist`,
          ErrorCodes.TEMPLATE_MISSING,
          { templatePath }
        );
      }

      // Copy template
      try {
        await fs.copy(templatePath, targetDir);
        console.log(chalk.green('📂 Project files created successfully'));
      } catch (err) {
        throw new CliError(
          `Failed to create files: ${err.message}`,
          ErrorCodes.COPY_FAILED,
          { source: templatePath, target: targetDir }
        );
      }

      // Modify project configuration
      try {
        await replaceFile({
          files: path.join(targetDir, 'package.json'),
          from: /"name": "vext-template"/g,
          to: `"name": "${projectName}"`,
          disableGlobs: true
        });
        console.log(chalk.green('✅ Project name configured successfully'));
      } catch (err) {
        throw new CliError(
          'Failed to modify package.json',
          ErrorCodes.CONFIG_FAILED,
          { file: 'package.json' }
        );
      }

      // Install dependencies
      console.log(chalk.yellow('\n📦 Installing dependencies...'));
      try {
        const manager = detectPackageManager(targetDir);
        const args = manager === 'yarn' ? [] : ['install'];
        await execa(manager, args, {
          cwd: targetDir,
          stdio: 'ignore',
          env: { FORCE_COLOR: 'true' }
        });
      } catch (err) {
        throw new CliError(
          `Dependency installation failed: ${err.message}`,
          ErrorCodes.INSTALL_FAILED,
          { targetDir }
        );
      }

      // Completion message
      console.log(chalk.green(`
🎉 Successfully created project ${chalk.cyan(projectName)}!
👉 Start with:
   ${chalk.cyan(`cd ${projectName}`)}
   ${chalk.cyan(`${detectPackageManager(targetDir)} run start:chrome`)}
      `));

    } catch (err) {
      console.error(chalk.red(`\n❌ Error (CODE: ${err.code || 'Unknown'}):`), err.message);

      // Cleanup residual files
      if (targetDir && fs.existsSync(targetDir)) {
        await fs.remove(targetDir);
        console.log(chalk.gray(`🗑️  Cleaned up residual directory: ${targetDir}`));
      }

      // Debug mode
      if (process.env.DEBUG) {
        console.log(chalk.grey('\n🛠️  Error Details:'), err);
      }

      process.exit(err.code || ErrorCodes.UNKNOWN_ERROR);
    }
  });

program.parse(process.argv);
