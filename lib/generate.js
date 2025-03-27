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

const nest = getNestBinary();

/**
 * Generates a NestJS component (module, controller, service, etc.).
 * @param {string} type - The type of component to generate (e.g., "mo", "co", "s").
 * @param {string} resourceName - The name of the resource to generate.
 * @param {Object} options - Additional options for the command.
 */
const generateComponent = (type, resourceName, options, projectName) => {
  const workingDirectory = projectName
    ? path.join(process.cwd(), projectName)
    : process.cwd();

  const command = `${nest} ${type} ${resourceName} ${
    Array.isArray(options) ? options.join(" ") : ""
  }`;

  execSync(command, { stdio: "inherit", cwd: workingDirectory });
};
export const generateProject = (projectName, options) =>
  generateComponent("new", projectName, options);

export const generateModule = (resourceName, options, projectName) =>
  generateComponent("g mo", resourceName, options, projectName);

export const generateController = (resourceName, options, projectName) =>
  generateComponent("g co", resourceName, options, projectName);

export const generateService = (resourceName, options, projectName) =>
  generateComponent("g s", resourceName, options, projectName);

export const generateGateway = (resourceName, options, projectName) =>
  generateComponent("g ga", resourceName, options, projectName);

export const generateInterceptor = (resourceName, options, projectName) =>
  generateComponent("g itc", resourceName, options, projectName);

export const generateMiddlware = (resourceName, options, projectName) =>
  generateComponent("g mi", resourceName, options, projectName);
