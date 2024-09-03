const yaml = require("js-yaml");
const fs = require("fs").promises;
const axios = require("axios");
const path = require("path");

const SKRIPTOR_URL = process.env.SKRIPTOR_URL;

if (!SKRIPTOR_URL) {
  throw new Error("SKRIPTOR_URL is not set in the environment variables");
}

async function load(config_path) {
  try {
    const config_response = await axios.get(
      `${SKRIPTOR_URL}/api/cli/${config_path}`
    );
    if (config_response.status === 404) {
      throw new Error(`Configuration file not found: ${config_path}`);
    }
    return yaml.load(config_response.data.config);
  } catch (error) {
    throw new Error(`Error loading configuration: ${error.message}`);
  }
}

module.exports = { load };
