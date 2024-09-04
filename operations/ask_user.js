const inquirer = require("inquirer");
const prompt = inquirer.createPromptModule();

async function ask_user(step, context) {
  context.utils.logger.info(`Prompting user with question: ${step.question}`);
  const answer = await prompt([
    {
      type: "input",
      name: "value",
      message: step.question,
    },
  ]);
  context.utils.logger.info(`User provided answer: ${answer.value}`);
  return answer.value;
}

module.exports = ask_user;
