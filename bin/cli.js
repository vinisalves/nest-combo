#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import yaml from 'js-yaml';
import { generateProject } from '../lib/generate.js';
import resources from '../lib/resources.js';
import installDependencies from '../lib/installDependencies.js';
import { validateResources, validateYml } from '../lib/utils.js';
import { printBanner, showUsage, showVersion } from '../lib/outputs.js';
const args = process.argv.slice(2);

export function main() {
  printBanner();
  const readArgs = getArgs();

  if (readArgs.askForVersion) {
    showVersion();
    return;
  }

  if (readArgs.askForHelp) {
    showUsage();
    return;
  }

  if (readArgs.hasCreateNewProject) {
    const packageManager = readArgs.hasPackageManager ? args[3] : undefined;
    createNewProject(
      readArgs.resourceName,
      packageManager,
      readArgs.doNotOpenVsCode,
    );
    return;
  }

  if (readArgs.hasYmlFile) {
    const file = args[1];
    createFullProjectFromYmlFile(file);
    return;
  }

  createResources(
    readArgs.resourceName,
    readArgs.hasNoSpec,
    readArgs.hasDryRun,
  );
}

/** 
 * Return arguments from the user input command
 * @returns {object} { resourceName,
    askForVersion,
    askForHelp,
    hasNoSpec,
    hasDryRun,
    hasYmlFile,
    hasCreateNewProject,
    hasPackageManager
    }
 */
function getArgs() {
  const resourceName = args[0];
  const askForVersion = args.includes('-v') || args.includes('--version');
  const askForHelp = args.includes('-h') || args.includes('--help');
  const hasNoSpec = args.includes('-ns') || args.includes('--no-spec');
  const hasDryRun = args.includes('-dr') || args.includes('--dry-run');
  const hasYmlFile = args.includes('-f') || args.includes('--file');
  const hasCreateNewProject =
    args.includes('-new') || args.includes('--new-project');
  const hasPackageManager =
    args.includes('-p') || args.includes('--package-manager');
  const doNotOpenVsCode = args.includes('-no-vscode');

  return {
    resourceName,
    askForVersion,
    askForHelp,
    hasNoSpec,
    hasDryRun,
    hasYmlFile,
    hasCreateNewProject,
    hasPackageManager,
    doNotOpenVsCode,
  };
}

/**
 * Genrate resources like Modules, Controller, Services, etc
 * @param {string} resourceName - Module/Controller/Service/etc name
 * @param {boolean} hasNoSpec  - if true do not generate spec files
 * @param {boolean} hasDryRun  - if true dry run mode
 * @throws {Error} Throws an error if something goes wrong
 */
function createResources(resourceName, hasNoSpec, hasDryRun) {
  try {
    validateResources(resourceName, args);
    resources.forEach((component) => {
      if (args.includes(component.flag) || args.includes(component.longFlag)) {
        console.log(
          chalk.green(`Generating ${component.name} for ${resourceName}`),
        );
        if (component.generator) {
          component.generator(resourceName, [
            hasNoSpec ? '--no-spec' : null,
            hasDryRun ? '--dry-run' : null,
          ]);
        } else {
          console.warn(
            chalk.yellow(`Warning:`) +
              ` Generator not implemented for ${component.name}`,
          );
        }
        console.log(
          chalk.green('---------------------------------------------------'),
        );
      }
    });
  } catch (error) {
    console.error(chalk.red(`Error creating resources: ${error.message}`));
    process.exit(1);
  }
}

/**
 * Creates a full NestJS project based on the configuration provided in a YAML file.
 *
 * This function performs the following steps:
 * 1. Parses the YAML file to extract project configuration (e.g., project name, dependencies, modules, etc.).
 * 2. Generates the base NestJS project structure using the `nest-cli`.
 * 3. Installs the specified project dependencies.
 * 4. Recursively creates nested modules, controllers, services, and other resources as defined in the YAML file.
 * 5. Opens the generated project in Visual Studio Code once it's done.
 *
 * @param {string} filePath - The absolute or relative path to the YAML configuration file.
 * @throws {Error} Throws an error if the YAML file is invalid, missing required fields, or if any step fails during execution.
 */
function createFullProjectFromYmlFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const ymlData = yaml.load(fileContent);

    validateYml(ymlData);

    const content = ymlData['nest-combo'];
    const projectName = content['project-name'];
    const packageManager = content['package-manager'] || 'npm';
    const dependencies = Array.isArray(content['dependencies'])
      ? content['dependencies']
      : [];
    const modules = Array.isArray(content['modules']) ? content['modules'] : [];

    const openVsCode = content['open-vscode'];

    console.log(chalk.green(`Generating project: ${projectName}`));
    generateProject(projectName, [`-p ${packageManager}`]);

    if (dependencies.length > 0) {
      console.log(chalk.cyan('Installing dependencies...'));
      installDependencies(projectName, dependencies);
    } else {
      console.log(chalk.yellow('No dependencies to install.'));
    }

    const recursiveAddModule = (parentModule, modules) => {
      for (const genModule of modules) {
        const {
          name,
          resources: moduleResources,
          options,
          modules: subModules,
        } = genModule;

        const pathModule = parentModule ? `${parentModule}/${name}` : name;

        console.log(chalk.cyan(`Processing module: ${pathModule}`));

        if (!Array.isArray(moduleResources)) {
          console.warn(
            chalk.yellow(
              `Invalid resources for module: ${pathModule}. Skipping.`,
            ),
          );
          continue;
        }

        moduleResources.forEach((resourceName) => {
          const resource = resources.find((r) => r.name === resourceName);

          if (!resource) {
            console.warn(
              chalk.yellow(`Unknown resource type: ${resourceName}. Skipping.`),
            );
            return;
          }

          console.log(
            chalk.magenta(`Generating ${resourceName} for ${pathModule}`),
          );
          resource.generator(pathModule, options, projectName);
          console.log(
            chalk.green('---------------------------------------------------'),
          );
        });

        if (subModules && subModules.length > 0) {
          recursiveAddModule(pathModule, subModules);
        }
      }
    };

    recursiveAddModule(null, modules);

    if (openVsCode) {
      CmdOpenVsCode(projectName);
    }

    console.log(
      chalk.green(
        '**************** succefully finished ************************** ',
      ),
    );
    showVersion();
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

/**
 * Creates a NestJS project and Open the generated project in Visual Studio Code once it's done
 *
 * @param {string} projectName - The projectName for the new project.
 * @param {string} packageManagere - The packageManeger such npm, yarn or pnpm, by default it uses npm
 * @throws {Error} Throws an error if something goes wrong.
 *
 */
function createNewProject(
  projectName,
  packageManager = 'npm',
  doNotOpenVsCode = false,
) {
  try {
    generateProject(projectName, [`-p ${packageManager}`]);
    if (doNotOpenVsCode) return;
    CmdOpenVsCode(projectName);
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

function CmdOpenVsCode(directory) {
  const workingDirectory = path.join(process.cwd(), directory);
  const command = 'code .';
  execSync(command, { cwd: workingDirectory });
}

main();
