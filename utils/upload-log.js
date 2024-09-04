const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");

/**
 * Uploads the log file to the specified endpoint for debugging.
 * @param {string} logFilePath - The path to the log file.
 * @param {string} scriptCode - The script code identifier.
 * @returns {Promise<void>}
 */
async function uploadLog(logFilePath, scriptCode, scriptStatus = "SUCCESS") {
  const skriptorUrl = process.env.SKRIPTOR_URL;
  if (!skriptorUrl) {
    throw new Error("SKRIPTOR_URL environment variable is not set.");
  }

  const form = new FormData();
  form.append("file", fs.createReadStream(logFilePath));
  form.append("script-code", scriptCode);
  form.append("script-status", scriptStatus);

  try {
    const response = await axios.post(`${skriptorUrl}/api/upload-logs`, form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    if (response.status !== 201) {
      throw new Error(`Received status ${response.status} from server`);
    }
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Server responded with status ${error.response.status}: ${error.response.data}`
      );
    } else if (error.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error(`Error setting up the request: ${error.message}`);
    }
  }
}

module.exports = uploadLog;
