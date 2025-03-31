import chalk from 'chalk';
import { execSync } from 'child_process';
import path from 'path';

/**
 * Installs the specified dependencies into the given project using the specified package manager.
 *
 * This function performs the following steps:
 * 1. Changes the working directory to the specified project folder.
 * 2. Logs the list of dependencies to be installed.
 * 3. Executes the appropriate package manager command to install the dependencies.
 *
 * @param {string} projectName - The name of the project folder where dependencies will be installed.
 * @param {string[]} dependencies - An array of dependency names (e.g., package names) to install.
 * @param {string} packageManager - The package manager to use: 'npm', 'yarn', or 'pnpm'.
 * @throws {Error} Throws an error if the installation command fails during execution.
 */
export default function installDependencies(
  projectName,
  dependencies,
  packageManager = 'npm',
) {
  const workingDirectory = path.join(process.cwd(), projectName);

  const supportedPackageManagers = ['npm', 'yarn', 'pnpm'];
  if (!supportedPackageManagers.includes(packageManager)) {
    throw new Error(
      `Unsupported package manager: ${packageManager}. Supported options are: ${supportedPackageManagers.join(
        ', ',
      )}`,
    );
  }

  try {
    if (Array.isArray(dependencies) && dependencies.length > 0) {
      console.log(chalk.cyan('Installing dependencies:'));
      for (const dependency of dependencies) {
        console.log(chalk.cyan(`- ${dependency}`));
      }

      let command;
      switch (packageManager) {
        case 'npm':
          command = `npm install ${dependencies.join(' ')}`;
          break;
        case 'yarn':
          command = `yarn add ${dependencies.join(' ')}`;
          break;
        case 'pnpm':
          command = `pnpm add ${dependencies.join(' ')}`;
          break;
        default:
          throw new Error(`Unsupported package manager: ${packageManager}`);
      }

      execSync(command, { stdio: 'inherit', cwd: workingDirectory });
      console.log(chalk.green('Dependencies installed successfully.'));
    } else {
      console.log(chalk.yellow('No dependencies to install.'));
    }
  } catch (error) {
    console.error(chalk.red(`Error installing dependencies: ${error.message}`));
    throw error;
  }
}
