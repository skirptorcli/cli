const fs = require('fs');
const path = require('path');

module.exports = async function createFile(step, context) {
  const filePath = path.resolve(context.basePath, step.path);
  fs.writeFileSync(filePath, step.content);
  console.log(`File created: ${filePath}`);
};
