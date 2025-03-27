import chalk from "chalk";
/**
 * Validate Yml File
 * @param {Object} ymlData
 */
export function validateYml(ymlData) {
  try {
    if (!ymlData || typeof ymlData !== "object" || !ymlData["nest-combo"]) {
      throw new Error("Invalid YAML file: Missing 'nest-combo' key.");
    }

    const nestCombo = ymlData["nest-combo"];

    if (
      !nestCombo["project-name"] ||
      typeof nestCombo["project-name"] !== "string"
    ) {
      throw new Error("Missing or invalid 'project-name'. Must be a string.");
    }

    if (
      nestCombo["package-manager"] &&
      typeof nestCombo["package-manager"] !== "string"
    ) {
      throw new Error("Invalid 'package-manager'. Must be a string.");
    }

    if (nestCombo.dependencies && !Array.isArray(nestCombo.dependencies)) {
      throw new Error("Invalid 'dependencies'. Must be an array.");
    }
    if (nestCombo.dependencies) {
      nestCombo.dependencies.forEach((dep, index) => {
        if (!dep.name || typeof dep.name !== "string") {
          throw new Error(
            `Invalid dependency at index ${index}. Each dependency must have a 'name' field as a string.`
          );
        }
      });
    }

    if (nestCombo.modules && !Array.isArray(nestCombo.modules)) {
      throw new Error("Invalid 'modules'. Must be an array.");
    }
    if (nestCombo.modules) {
      validateModules(nestCombo.modules);
    }

    console.log(chalk.green("YAML file is valid."));
  } catch (error) {
    console.error(chalk.red(`Validation Error: ${error.message}`));
    process.exit(1);
  }
}

/**
 * Recursively validate modules and sub-modules.
 * @param {Array} modules - The list of modules to validate.
 */
function validateModules(modules) {
  modules.forEach((module, index) => {
    if (!module.name || typeof module.name !== "string") {
      throw new Error(
        `Invalid module at index ${index}. Each module must have a 'name' field as a string.`
      );
    }

    if (module.resources && !Array.isArray(module.resources)) {
      throw new Error(
        `Invalid 'resources' for module '${module.name}'. Must be an array.`
      );
    }
    if (module.resources) {
      const validResources = [
        "module",
        "controller",
        "service",
        "gateway",
        "middleware",
        "interceptor",
      ];
      module.resources.forEach((resource, resIndex) => {
        if (!validResources.includes(resource)) {
          throw new Error(
            `Invalid resource '${resource}' at index ${resIndex} for module '${
              module.name
            }'. Valid resources are: ${validResources.join(", ")}.`
          );
        }
      });
    }

    if (module.options && !Array.isArray(module.options)) {
      throw new Error(
        `Invalid 'options' for module '${module.name}'. Must be an array.`
      );
    }

    if (module.modules && !Array.isArray(module.modules)) {
      throw new Error(
        `Invalid 'modules' for module '${module.name}'. Must be an array.`
      );
    }
    if (module.modules) {
      validateModules(module.modules);
    }
  });
}
