const fs = require("fs").promises;
const path = require("path");

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
