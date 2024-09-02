const fs = require('fs');
const path = require('path');

module.exports = async function createDirectory(step, context) {
  const dirPath = path.resolve(context.basePath, step.path);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory created: ${dirPath}`);
  } else {
    console.log(`Directory already exists: ${dirPath}`);
  }
};
