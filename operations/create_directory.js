const fs = require("fs").promises;
const path = require("path");

/**
 * Creates a new directory at the specified path.
 * Logs the creation process and any errors encountered.
 * @param {Object} step - The step object containing the path for the new directory.
 * @param {Object} context - The context object containing utilities like the logger.
 * @returns {Promise<void>} - Resolves when the directory is successfully created.
 */
async function create_directory(step, context) {
  context.utils.logger.info(`Creating directory at: ${step.path}`);
  try {
    await fs.mkdir(step.path, { recursive: true });
    context.utils.logger.info(`Created directory: ${step.path}`);
  } catch (error) {
    context.utils.logger.error(`Failed to create directory: ${error.message}`);
    throw new Error(`Failed to create directory: ${error.message}`);
  }
}

module.exports = create_directory;
