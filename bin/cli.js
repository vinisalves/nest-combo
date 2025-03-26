#!/usr/bin/env node
import chalk from "chalk";
import {
  generateModule,
  generateController,
  generateService,
  generateInterceptor,
  generateGateway,
  generateMiddlware,
} from "../lib/generate.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

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
  const { askForHelp, askForVersion, moduleName, hasDryRun, hasNoSpec } =
    getArgs();

  if (askForVersion) {
    showVersion();
    process.exit(0);
  }
  if (askForHelp) {
    showUsage();
    process.exit(0);
  }

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

  return {
    moduleName,
    askForVersion,
    askForHelp,
    hasNoSpec,
    hasDryRun,
  };
}

function showUsage() {
  console.log(`
${chalk.yellow("Usage:")} nest-combo <module-name> [options]

${chalk.yellow("Options:")}
  ${chalk.cyan("-m,   --module")}        Generate a Module
  ${chalk.cyan("-c,   --controller")}    Generate a Controller
  ${chalk.cyan("-s,   --service")}       Generate a Service
  ${chalk.cyan("-g,   --gateway")}       Generate a Gateway
  ${chalk.cyan("-mw,  --middleware")}    Generate Middleware
  ${chalk.cyan("-itc, --interceptor")}   Generate an Interceptor

${chalk.bgMagenta("Optional:")}
  ${chalk.cyan("-ns, --no-spec")}     Do not generate spec (test) files
  ${chalk.cyan(
    "-dr, --dry-run"
  )}     Report actions that would be taken without writing out results.

${chalk.yellow("Example:")}
  nest-combo users -m -c -s
`);
}

function showVersion() {
  const { name, version } = require("../package.json");
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

main();
