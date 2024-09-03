const fs = require("fs").promises;
const path = require("path");

async function create_file(step, context) {
  try {
    await fs.mkdir(path.dirname(step.path), { recursive: true });
    await fs.writeFile(step.path, step.content);
    console.log(`Created file: ${step.path}`);
  } catch (error) {
    throw new Error(`Failed to create file: ${error.message}`);
  }
}

module.exports = create_file;
