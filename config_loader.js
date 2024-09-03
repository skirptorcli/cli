const yaml = require("js-yaml");
const fs = require("fs").promises;
const axios = require("axios");
const path = require("path");

const config_files_path = path.join(__dirname, "config_files");

async function load(config_path) {
  try {
    // const file_contents = await fs.readFile(config_path, "utf8");
    const config_response = await axios.get(
      `http://localhost:3000/api/cli/${config_path}`
    );
    if (config_response.status === 404) {
      throw new Error(`Configuration file not found: ${config_path}`);
    }

    await fs.writeFile(
      path.join(config_files_path, config_path + ".yaml"),
      config_response.data.config
    );
    return yaml.load(config_response.data.config);
  } catch (error) {
    throw new Error(`Error loading configuration: ${error.message}`);
  }
}

module.exports = { load };
