import { execSync } from 'child_process';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Determines the path to the Nest CLI binary to use for project generation.
 *
 * This function checks if the globally installed Nest CLI is available by running `nest --version`.
 * - If the global Nest CLI is found, it logs a message indicating that the global installation will be used and returns `"nest"`.
 * - If the global Nest CLI is not found, it falls back to using the locally cached Nest CLI binary from the `node_modules` directory.
 *
 * @returns {string} The command or path to the Nest CLI binary:
 *   - `"nest"` if the global Nest CLI is available.
 *   - A local path (e.g., `../node_modules/.bin/nest`) if the global Nest CLI is not available.
 */
const getNestBinary = () => {
  try {
    execSync('nest --version', { stdio: 'ignore' });
    console.log(
      chalk.bgGreenBright('*** Using your Nest CLI Installation *** \n'),
    );
    return 'nest';
  } catch (_) {
    console.log(
      chalk.bgBlueBright(
        '*** Using nest-combo cached Nest CLI Installation *** \n',
      ),
    );
    return path.join(__dirname, '../node_modules/.bin/nest');
  }
};

const nestCli = getNestBinary();

export default nestCli;
