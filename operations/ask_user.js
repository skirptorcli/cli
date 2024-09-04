const inquirer = require("inquirer");
const prompt = inquirer.createPromptModule();

/**
 * Prompts the user for input based on the provided step configuration.
 * Logs the question and the user's response using the provided logger.
 * @param {Object} step - The step object containing the question to ask.
 * @param {Object} context - The context object containing utilities like the logger.
 * @returns {Promise<string>} - The user's input as a string.
 */
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
