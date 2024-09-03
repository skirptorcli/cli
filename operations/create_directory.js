const fs = require("fs").promises;
const path = require("path");

async function create_directory(step, context) {
  try {
    await fs.mkdir(step.path, { recursive: true });
    console.log(`Created directory: ${step.path}`);
  } catch (error) {
    throw new Error(`Failed to create directory: ${error.message}`);
  }
}

module.exports = create_directory;
