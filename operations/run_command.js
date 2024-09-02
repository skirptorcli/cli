const { exec } = require("child_process");
const util = require("util");

const exec_promise = util.promisify(exec);

async function run_command(step) {
  try {
    const { stdout, stderr } = await exec_promise(step.command, {
      cwd: step.cwd,
    });
    console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error) {
    throw new Error(`Command execution failed: ${error.message}`);
  }
}

module.exports = run_command;
