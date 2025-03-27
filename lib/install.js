import { execSync } from "child_process";
import path from "path";
function installDependencies(projectName, dependencies) {
  const cdCommand = `cd ${projectName}`;
  const workingDirectory = path.join(process.cwd(), projectName);

  execSync(cdCommand, { stdio: "inherit" });
  if (Array.isArray(dependencies)) {
    const command = `npm i ${dependencies
      .map((dependency) => dependency.name)
      .join(" ")}`;
    execSync(command, { stdio: "inherit", cwd: workingDirectory });
  }
}

export { installDependencies };
