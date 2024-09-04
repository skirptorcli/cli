const yaml = require("js-yaml");
const axios = require("axios");

const SKRIPTOR_URL = process.env.SKRIPTOR_URL;

if (!SKRIPTOR_URL) {
  logger.error("SKRIPTOR_URL is not set in the environment variables");
  throw new Error("SKRIPTOR_URL is not set in the environment variables");
}

async function load(config_path, logger) {
  try {
    const config_response = await axios.get(
      `${SKRIPTOR_URL}/api/cli/${config_path}`
    );
    if (config_response.status === 404) {
      logger.error(`Configuration file not found: ${config_path}`);
      throw new Error(`Configuration file not found: ${config_path}`);
    }
    return yaml.load(config_response.data.config);
  } catch (error) {
    logger.error(`Error loading configuration: ${error.message}`);
    throw new Error(`Error loading configuration: ${error.message}`);
  }
}

module.exports = { load };
