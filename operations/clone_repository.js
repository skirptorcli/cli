const { exec } = require('child_process');

/**
 * Clones a Git repository to a specified destination.
 * Logs the cloning process and any errors encountered.
 * @param {Object} step - The step object containing the repository URL and optional destination.
 * @param {Object} context - The context object containing utilities like the logger.
 * @returns {Promise<void>} - Resolves when the repository is successfully cloned.
 */
module.exports = async function clone_repository(step, context) {
  context.utils.logger.info(`Cloning repository from: ${step.repository_url}`);
  return new Promise((resolve, reject) => {
    const command = `git clone ${step.repository_url} ${step.destination || ''}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        context.utils.logger.error(`Error cloning repository: ${stderr}`);
        return reject(error);
      }
      context.utils.logger.info(`Repository cloned successfully: ${stdout}`);
      resolve();
    });
  });
};
