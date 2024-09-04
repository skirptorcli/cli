const { spawn } = require("child_process");

/**
 * Executes a shell command in a specified working directory.
 * Logs the command execution process, output, and any errors encountered.
 * @param {Object} step - The step object containing the command and working directory.
 * @param {Object} context - The context object containing utilities like the logger.
 * @returns {Promise<void>} - Resolves when the command is successfully executed.
 */
async function run_command(step, context) {
  // Log the command and directory before execution
  context.utils.logger.info(
    `Executing command: ${step.command} in directory: ${step.cwd}`
  );

  try {
    // Split the command string into command and arguments
    const commandParts = step.command.split(" ");
    const command = commandParts[0];
    const args = commandParts.slice(1);

    await new Promise((resolve, reject) => {
      // Spawn a new process with the given command and arguments
      const child = spawn(command, args, { cwd: step.cwd });

      // Listen for data on stdout (standard output)
      child.stdout.on("data", (data) => {
        const output = data.toString().trim();
        context.utils.logger.info(`Command output: ${output}`);
      });

      // Listen for data on stderr (standard error)
      child.stderr.on("data", (data) => {
        const error = data.toString().trim();
        context.utils.logger.error(`Command error: ${error}`);
      });

      // Listen for the 'close' event, which is emitted when the process ends
      child.on("close", (code) => {
        if (code !== 0) {
          // Non-zero exit code indicates an error
          context.utils.logger.error(
            `Command execution failed with code: ${code}`
          );
          reject(new Error(`Command execution failed with code: ${code}`));
        } else {
          // Zero exit code indicates successful execution
          context.utils.logger.info("Command execution completed successfully");
          resolve();
        }
      });

      // Listen for any errors that occur while trying to execute the command
      child.on("error", (error) => {
        context.utils.logger.error(`Command execution error: ${error.message}`);
        reject(error);
      });
    });
  } catch (error) {
    // Catch and log any errors that weren't caught by the above error handlers
    context.utils.logger.error(`Command execution failed: ${error.message}`);
    throw error; // Re-throw the error to be handled by the caller
  }
}

module.exports = run_command;
