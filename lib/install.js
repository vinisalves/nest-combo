import chalk from "chalk";
import { execSync } from "child_process";
import path from "path";
function installDependencies(projectName, dependencies) {
  const cdCommand = `cd ${projectName}`;
  const workingDirectory = path.join(process.cwd(), projectName);

  execSync(cdCommand, { stdio: "inherit" });
  try {
    if (Array.isArray(dependencies)) {
      for (const depency of dependencies) {
        chalk.cyan(`- ${depency}`);
      }
      const command = `npm i ${dependencies.join(" ")}`;
      execSync(command, { stdio: "inherit", cwd: workingDirectory });
    }
  } catch (error) {
    chalk.red(`Error installing dependencies`);
  }
}

export { installDependencies };
