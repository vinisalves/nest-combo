#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import yaml from "js-yaml";
import {
  generateModule,
  generateController,
  generateService,
  generateInterceptor,
  generateGateway,
  generateMiddlware,
  generateProject,
} from "../lib/generate.js";
import { installDependencies } from "../lib/install.js";
import { createRequire } from "module";
import { validateYml } from "../lib/utils.js";
const require = createRequire(import.meta.url);
const { name, version } = require("../package.json");

const args = process.argv.slice(2);
const resources = [
  {
    name: "module",
    flag: "-m",
    longFlag: "--module",
    generator: generateModule,
  },
  {
    name: "controller",
    flag: "-c",
    longFlag: "--controller",
    generator: generateController,
  },
  {
    name: "service",
    flag: "-s",
    longFlag: "--service",
    generator: generateService,
  },
  {
    name: "gateway",
    flag: "-g",
    longFlag: "--gateway",
    generator: generateGateway,
  },
  {
    name: "middleware",
    flag: "-mw",
    longFlag: "--middleware",
    generator: generateMiddlware,
  },
  {
    name: "interceptor",
    flag: "-itc",
    longFlag: "--interceptor",
    generator: generateInterceptor,
  },
];

function main() {
  printBanner();
  const {
    askForHelp,
    askForVersion,
    moduleName,
    hasDryRun,
    hasNoSpec,
    hasYmlFile,
  } = getArgs();

  switch (true) {
    case askForVersion:
      showVersion();
      process.exit(0);
      break;

    case askForHelp:
      showUsage();
      process.exit(0);
      break;

    case hasYmlFile:
      const file = args[1];
      loadFromYml(file);
      process.exit(0);
      break;

    default:
      execute(moduleName, hasNoSpec, hasDryRun);
  }
}

function execute(moduleName, hasNoSpec, hasDryRun) {
  validate(moduleName);
  resources.forEach((component) => {
    if (args.includes(component.flag) || args.includes(component.longFlag)) {
      console.log(
        chalk.green(`Generating ${component.name} for module ${moduleName}`)
      );
      if (component.generator) {
        component.generator(moduleName, [
          hasNoSpec ? "--no-spec" : null,
          hasDryRun ? "--dry-run" : null,
        ]);
      } else {
        console.warn(
          chalk.yellow(`Warning:`) +
            ` Generator not implemented for ${component.name}`
        );
      }
      console.log(
        chalk.green("---------------------------------------------------")
      );
    }
  });
}

function getArgs() {
  const moduleName = args[0];
  const askForVersion = args.includes("-v") || args.includes("--version");
  const askForHelp = args.includes("-h") || args.includes("--help");
  const hasNoSpec = args.includes("-ns") || args.includes("--no-spec");
  const hasDryRun = args.includes("-dr") || args.includes("--dry-run");
  const hasYmlFile = args.includes("-f") || args.includes("--file");

  return {
    moduleName,
    askForVersion,
    askForHelp,
    hasNoSpec,
    hasDryRun,
    hasYmlFile,
    validateYmlFile,
  };
}

function showUsage() {
  console.log(`
${chalk.yellow("Usage:")} nest-combo <module-name> [options]

${chalk.yellow("Options:")}
  ${chalk.cyan("-m,   --module")}         Generate a Module
  ${chalk.cyan("-c,   --controller")}     Generate a Controller
  ${chalk.cyan("-s,   --service")}        Generate a Service
  ${chalk.cyan("-g,   --gateway")}        Generate a Gateway
  ${chalk.cyan("-mw,  --middleware")}     Generate Middleware
  ${chalk.cyan("-itc, --interceptor")}    Generate an Interceptor
  ${chalk.cyan("-f,   --file")}           Generate project from yml file  

${chalk.bgMagenta("Optional:")}
  ${chalk.cyan("-ns, --no-spec")}     Do not generate spec (test) files
  ${chalk.cyan(
    "-dr, --dry-run"
  )}     Report actions that would be taken without writing out results.

${chalk.yellow("Example:")}
  nest-combo users -m -c -s
  nest-combo -f project.yml
`);
}

function showVersion() {
  console.log(chalk.green(`${name} - version: ${version}`));
}

function validate(moduleName) {
  if (!moduleName) {
    console.error(chalk.red("Error:") + " Module name is required.");
    showUsage();
    process.exit(1);
  }
  const hasComponentFlags = resources.some(
    (component) =>
      args.includes(component.flag) || args.includes(component.longFlag)
  );

  if (!hasComponentFlags) {
    console.error(
      chalk.red("Error:") +
        ` At least one flag (${resources
          .map((resource) => resource.flag)
          .join(",")}) is required.`
    );
    showUsage();
    process.exit(1);
  }
}

function loadFromYml(file) {
  try {
    const fileContent = fs.readFileSync(file, "utf-8");
    const ymlData = yaml.load(fileContent);

    validateYml(ymlData);

    const content = ymlData["nest-combo"];
    const projectName = content["project-name"];
    const packageManager = content["package-manager"] || "npm";
    const dependencies = Array.isArray(content["dependencies"])
      ? content["dependencies"]
      : [];
    const modules = Array.isArray(content["modules"]) ? content["modules"] : [];

    const openVsCode = content["open-vscode"];

    console.log(chalk.green(`Generating project: ${projectName}`));
    generateProject(projectName, [`-p ${packageManager}`]);

    if (dependencies.length > 0) {
      console.log(chalk.cyan("Installing dependencies..."));
      installDependencies(projectName, dependencies);
    } else {
      console.log(chalk.yellow("No dependencies to install."));
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
              `Invalid resources for module: ${pathModule}. Skipping.`
            )
          );
          continue;
        }

        moduleResources.forEach((resourceName) => {
          const resource = resources.find((r) => r.name === resourceName);

          if (!resource) {
            console.warn(
              chalk.yellow(`Unknown resource type: ${resourceName}. Skipping.`)
            );
            return;
          }

          console.log(
            chalk.magenta(`Generating ${resourceName} for ${pathModule}`)
          );
          resource.generator(pathModule, options, projectName);
          console.log(
            chalk.green("---------------------------------------------------")
          );
        });

        if (subModules && subModules.length > 0) {
          recursiveAddModule(pathModule, subModules);
        }
      }
    };

    recursiveAddModule(null, modules);

    if (openVsCode) {
      const workingDirectory = path.join(process.cwd(), projectName);
      const command = "code .";
      execSync(command, { cwd: workingDirectory });
    }

    console.log(
      chalk.green(
        "**************** succefully finished ************************** "
      )
    );
    showVersion();
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

function printBanner() {
  console.log(
    chalk.magenta(`      
███╗   ██╗███████╗███████╗████████╗       ██████╗ ██████╗ ███╗   ███╗██████╗  ██████╗ 
████╗  ██║██╔════╝██╔════╝╚══██╔══╝      ██╔════╝██╔═══██╗████╗ ████║██╔══██╗██╔═══██╗
██╔██╗ ██║█████╗  ███████╗   ██║   █████╗██║     ██║   ██║██╔████╔██║██████╔╝██║   ██║
██║╚██╗██║██╔══╝  ╚════██║   ██║   ╚════╝██║     ██║   ██║██║╚██╔╝██║██╔══██╗██║   ██║
██║ ╚████║███████╗███████║   ██║         ╚██████╗╚██████╔╝██║ ╚═╝ ██║██████╔╝╚██████╔╝
╚═╝  ╚═══╝╚══════╝╚══════╝   ╚═╝          ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═════╝  ╚═════╝         
    `)
  );
  console.log(
    chalk.bgWhite(
      chalk.bold(
        `********************************************************************** version: ${version} `
      )
    )
  );
}

main();
