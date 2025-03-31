import chalk from 'chalk';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { name, version } = require('../package.json');

/**
 * Print the ASCII Art Banner
 */
export function printBanner() {
  console.log(
    chalk.magenta(`      
  ███╗   ██╗███████╗███████╗████████╗       ██████╗ ██████╗ ███╗   ███╗██████╗  ██████╗ 
  ████╗  ██║██╔════╝██╔════╝╚══██╔══╝      ██╔════╝██╔═══██╗████╗ ████║██╔══██╗██╔═══██╗
  ██╔██╗ ██║█████╗  ███████╗   ██║   █████╗██║     ██║   ██║██╔████╔██║██████╔╝██║   ██║
  ██║╚██╗██║██╔══╝  ╚════██║   ██║   ╚════╝██║     ██║   ██║██║╚██╔╝██║██╔══██╗██║   ██║
  ██║ ╚████║███████╗███████║   ██║         ╚██████╗╚██████╔╝██║ ╚═╝ ██║██████╔╝╚██████╔╝
  ╚═╝  ╚═══╝╚══════╝╚══════╝   ╚═╝          ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═════╝  ╚═════╝         
      `),
  );
  console.log(
    chalk.bgWhite(
      chalk.bold(
        `********************************************************************** version: ${version} `,
      ),
    ),
  );
}

/**
 * Show Instructions how to use nest-combo
 */
export function showUsage() {
  console.log(`
  ${chalk.yellow('Usage:')} nest-combo <<project|module>-name> [options]
  
  ${chalk.yellow('Options:')}
    ${chalk.cyan('-new,   --new-project')}    Create a new project
    ${chalk.cyan('-m,     --module')}         Generate a Module
    ${chalk.cyan('-c,     --controller')}     Generate a Controller
    ${chalk.cyan('-s,     --service')}        Generate a Service
    ${chalk.cyan('-g,     --gateway')}        Generate a Gateway
    ${chalk.cyan('-mw,    --middleware')}     Generate Middleware
    ${chalk.cyan('-itc,   --interceptor')}    Generate an Interceptor
    ${chalk.cyan('-f,     --file')}           Generate project from yml file    
  
  ${chalk.bgMagenta('Optional for Modules:')}
    ${chalk.cyan('-ns, --no-spec')}     Do not generate spec (test) files
    ${chalk.cyan(
      '-dr, --dry-run',
    )}     Report actions that would be taken without writing out results.
  
  ${chalk.yellow('Example:')}
    To create a new project:
    ${chalk.cyan(
      `nest-combo my-project-name -new ${chalk.gray(
        '# VsCode will be opened directly into your new project',
      )}`,
    )}
    
    To create a module, controller and servide in a single line command
    ${chalk.cyan('nest-combo users -m -c -s')} 
  
    To load a full project from a yml file
    ${chalk.cyan('nest-combo -f project.yml')}
  `);
}

/**
 * Show current version
 */
export function showVersion() {
  console.log(chalk.green(`${name} - version: ${version}`));
}
