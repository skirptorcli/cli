const { spawn } = require("child_process");

/**
 * Executes a shell command in a specified working directory.
 * Logs the command execution process and any errors encountered.
 * @param {Object} step - The step object containing the command and working directory.
 * @param {Object} context - The context object containing utilities like the logger.
 * @returns {Promise<void>} - Resolves when the command is successfully executed.
 */
async function run_command(step, context) {
  context.utils.logger.info(`Executing command: ${step.command} in directory: ${step.cwd}`);
  try {
    const commandParts = step.command.split(' ');
    const command = commandParts[0];
    const args = commandParts.slice(1);

    await new Promise((resolve, reject) => {
      const child = spawn(command, args, { cwd: step.cwd, stdio: 'inherit' });

      child.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Command execution failed with code: ${code}`));
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    context.utils.logger.error(`Command execution failed: ${error.message}`);
    throw new Error(`Command execution failed: ${error.message}`);
  }
}

module.exports = run_command;
