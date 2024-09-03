const { spawn } = require("child_process");

async function run_command(step, context) {
  try {
    const commandParts = step.command.split(' ');
    const command = commandParts[0];
    const args = commandParts.slice(1);

    const child = spawn(command, args, { cwd: step.cwd, stdio: 'inherit' });

    child.on('close', (code) => {
      if (code !== 0) {
        throw new Error(`Command execution failed with code: ${code}`);
      }
    });
  } catch (error) {
    throw new Error(`Command execution failed: ${error.message}`);
  }
}

module.exports = run_command;
