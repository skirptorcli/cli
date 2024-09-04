const fs = require("fs").promises;
const path = require("path");

/**
 * Creates a new file with specified content at the given path.
 * Logs the creation process and any errors encountered.
 * @param {Object} step - The step object containing the path and content for the new file.
 * @param {Object} context - The context object containing utilities like the logger.
 * @returns {Promise<void>} - Resolves when the file is successfully created.
 */
async function create_file(step, context) {
  context.utils.logger.info(`Creating file at: ${step.path}`);
  try {
    await fs.mkdir(path.dirname(step.path), { recursive: true });
    await fs.writeFile(step.path, step.content);
    context.utils.logger.info(`Created file: ${step.path}`);
  } catch (error) {
    context.utils.logger.error(`Failed to create file: ${error.message}`);
    throw new Error(`Failed to create file: ${error.message}`);
  }
}

module.exports = create_file;
