const { exec } = require('child_process');

module.exports = async function clone_repository(step, context) {
  return new Promise((resolve, reject) => {
    const command = `git clone ${step.repository_url} ${step.destination || ''}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error cloning repository: ${stderr}`);
        return reject(error);
      }
      console.log(`Repository cloned: ${stdout}`);
      resolve();
    });
  });
};
