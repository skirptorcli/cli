const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");

/**
 * Updates a file based on the provided instructions.
 *
 * @param {Object} step - The step object containing the path and instructions for the update.
 * @param {Object} context - The context object containing utilities like the logger.
 */
async function update_file(step, context) {
  try {
    const filePath = path.resolve(step.path);
    const currentContent = await fs.readFile(filePath, "utf8");

    const updatedContent = await getLlmUpdate(
      currentContent,
      step.instructions
    );

    await fs.writeFile(filePath, updatedContent);
    context.utils.logger.info(`Updated file: ${step.path}`);
  } catch (error) {
    context.utils.logger.error(`Failed to update file: ${error.message}`);
    throw new Error(`Failed to update file: ${error.message}`);
  }
}

async function getLlmUpdate(currentContent, instructions) {
  const groqKey = process.env.GROQ_API_KEY; // Make sure to set this environment variable
  const openAiKey = process.env.OPEN_AI_API_KEY; // Make sure to set this environment variable

  if (!groqKey && !openAiKey) {
    throw new Error(
      "GROQ_API_KEY or OPEN_AI_API_KEY are not set in the environment variables"
    );
  }
  let client = null;
  let model = null;
  if (groqKey) {
    // groq client
    client = axios.create({
      baseURL: "https://api.groq.com/openai/v1",
      headers: {
        Authorization: `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
    });
    model = "llama-3.1-70b-versatile";
  } else if (openAiKey) {
    // openai client
    client = axios.create({
      baseURL: "https://api.openai.com/v1",
      headers: {
        Authorization: `Bearer ${openAiKey}`,
        "Content-Type": "application/json",
      },
    });
    model = "gpt-4o-mini";
  }

  const prompt = `
Given the following file content:

${currentContent}

Please update the file based on these instructions:

${instructions}

Provide the full updated file content, return as a string. Do not include any extra information.
`;

  try {
    const response = await client.post("/chat/completions", {
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that updates file contents based on instructions.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 4000, // Adjust as needed
      temperature: 0.4,
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    context.utils.logger.error(
      `Error calling Groq API: ${error.response?.data || error.message}`
    );
    throw error;
  }
}

module.exports = update_file;
