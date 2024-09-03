#!/usr/bin/env node
require("dotenv").config();
const path = require("path");
const { program } = require("commander");
const config_loader = require("./config_loader");
const operation_loader = require("./operation_loader");
const execution_engine = require("./execution_engine");

async function main() {
  program
    .name("skriptor")
    .description("CLI to execute project setup based on a config file")
    .version("1.0.0")
    .argument("<config>", "Path to the configuration file")
    .action(async (config_path) => {
      try {
        // Load configuration
        const config = await config_loader.load(config_path);

        // Load operations
        const operations = await operation_loader.load_operations(
          path.join(__dirname, "operations")
        );

        // Execute configuration
        const engine = new execution_engine(operations);
        await engine.execute(config);

        console.log("Setup completed successfully!");
      } catch (error) {
        console.error("Error during setup:", error.message);
        process.exit(1);
      }
    });

  program.parse(process.argv);
}

main().catch(console.error);
