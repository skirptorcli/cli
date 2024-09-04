const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");

async function update_file(step, context) {
  try {
    const filePath = path.resolve(step.path);
    const currentContent = await fs.readFile(filePath, "utf8");

    const updatedContent = await getGroqUpdate(
      currentContent,
      step.instructions
    );

    await fs.writeFile(filePath, updatedContent);
    console.log(`Updated file: ${step.path}`);
  } catch (error) {
    throw new Error(`Failed to update file: ${error.message}`);
  }
}

async function getGroqUpdate(currentContent, instructions) {
  const apiKey = process.env.GROQ_API_KEY; // Make sure to set this environment variable
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set in the environment variables");
  }
  // openai client
  const client = axios.create({
    baseURL: "https://api.openai.com/v1",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });
  // grop client
  // const client = axios.create({
  //   baseURL: "https://api.groq.com/openai/v1",
  //   headers: {
  //     Authorization: `Bearer ${apiKey}`,
  //     "Content-Type": "application/json",
  //   },
  // });

  const prompt = `
Given the following file content:

${currentContent}

Please update the file based on these instructions:

${instructions}

Provide the full updated file content, return as a string. Do not include any extra information.
`;

  try {
    const response = await client.post("/chat/completions", {
      model: "gpt-4o-mini", // or another appropriate Groq model
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
    console.error(
      "Error calling Groq API:",
      error.response?.data || error.message
    );
    throw error;
  }
}

module.exports = update_file;
