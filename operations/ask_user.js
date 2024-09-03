const inquirer = require("inquirer");
const prompt = inquirer.createPromptModule();

async function ask_user(step, context) {
  const answer = await prompt([
    {
      type: "input",
      name: "value",
      message: step.question,
    },
  ]);
  return answer.value;
}

module.exports = ask_user;
