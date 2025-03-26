import { execSync } from "child_process";
import { fileURLToPath } from "url";
import path from "path";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getNestBinary = () => {
  try {
    execSync("nest --version", { stdio: "ignore" });
    console.log(
      chalk.bgMagenta("*** Using global Nest CLI Installation *** \n")
    );
    return "nest";
  } catch (error) {
    console.log(
      chalk.bgBlueBright("*** Using local Nest CLI Installation *** \n")
    );
    return path.join(__dirname, "../node_modules/.bin/nest");
  }
};

/**
 * Generates a NestJS component (module, controller, service, etc.).
 * @param {string} type - The type of component to generate (e.g., "mo", "co", "s").
 * @param {string} moduleName - The name of the module to generate.
 * @param {Object} options - Additional options for the command.
 */
const generateComponent = (type, moduleName, options) => {
  const command = `${nest} g ${type} ${moduleName} ${options.join(" ")}`;
  // console.log(`Running command: ${command}`);
  execSync(command, { stdio: "inherit" });
};

export const generateModule = (moduleName, options) =>
  generateComponent("mo", moduleName, options);

export const generateController = (moduleName, options) =>
  generateComponent("co", moduleName, options);

export const generateService = (moduleName, options) =>
  generateComponent("s", moduleName, options);

export const generateGateway = (moduleName, options) =>
  generateComponent("ga", moduleName, options);

export const generateInterceptor = (moduleName, options) =>
  generateComponent("itc", moduleName, options);

export const generateMiddlware = (moduleName, options) =>
  generateComponent("mi", moduleName, options);

const nest = getNestBinary();
