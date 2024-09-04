/**
 * This module is responsible for loading operation modules from the specified directory.
 * It dynamically imports each JavaScript file in the directory as an operation,
 * making them available for use in the execution engine.
 */

const fs = require("fs").promises;
const path = require("path");

/**
 * Loads operation modules from the specified directory.
 *
 * @param {string} operations_dir - The directory containing operation modules.
 * @returns {object} - An object mapping operation names to their respective functions.
 */
async function load_operations(operations_dir) {
  const operations = {};
  const files = await fs.readdir(operations_dir);

  for (const file of files) {
    if (file.endsWith(".js")) {
      const operation_name = path.basename(file, ".js");
      const operation_path = path.join(operations_dir, file);
      operations[operation_name] = require(operation_path);
    }
  }

  return operations;
}

module.exports = { load_operations };
