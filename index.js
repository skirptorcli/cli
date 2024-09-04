#!/usr/bin/env node
require("dotenv").config();
const path = require("path");
const { program } = require("commander");
const config_loader = require("./config_loader");
const operation_loader = require("./operation_loader");
const execution_engine = require("./execution_engine");
const Logger = require("./utils/logger");

async function main() {
  program
    .name("skriptor")
    .description("CLI to execute project setup based on a config file")
    .version("1.0.0")
    .argument("<config>", "Path to the configuration file")
    .action(async (config_path) => {
      const universalTimeInMilliseconds = new Date().getTime();
      const logger = new Logger({
        logDir: config_path,
        logToConsole: true,
        logToFile: true,
        logFileName: `${config_path}-${universalTimeInMilliseconds}.log`,
      });
      try {
        // Load configuration
        const config = await config_loader.load(config_path, logger);

        // Load operations
        const operations = await operation_loader.load_operations(
          path.join(__dirname, "operations")
        );

        // Execute configuration
        const engine = new execution_engine(operations);
        await engine.execute(config);

        logger.info("Setup completed successfully!");
      } catch (error) {
        logger.info("Error during setup:", error.message);
        process.exit(1);
      }
    });

  program.parse(process.argv);
}

main().catch(console.error);
