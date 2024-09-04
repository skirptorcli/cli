const { exec } = require('child_process');

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
