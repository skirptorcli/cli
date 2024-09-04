#!/usr/bin/env node
/**
 * This script serves as the entry point for the Skriptor CLI tool.
 * It loads environment variables, parses command-line arguments, and executes
 * project setup based on a specified configuration file.
 */

require("dotenv").config();
const path = require("path");
const { program } = require("commander");
const config_loader = require("./config_loader");
const operation_loader = require("./operation_loader");
const execution_engine = require("./execution_engine");
const Logger = require("./utils/logger");

/**
 * Main function to execute the Skriptor CLI tool.
 * It sets up the command-line interface, loads configurations and operations,
 * and executes the setup process.
 */
async function main() {
  program
    .name("skriptor")
    .description("CLI to execute project setup based on a config file")
    .version("1.0.0")
    .argument("<config>", "Path to the configuration file")
    .command("view-logs <config> <logFileName>")
    .description("View the specified log file")
    .action((config, logFileName) => {
      const logFilePath = path.join(__dirname, config, logFileName);
      console.log(`Accessing log file: ${logFilePath}`);
      require("fs").readFile(logFilePath, "utf8", (err, data) => {
        if (err) {
          console.error(`Error reading log file: ${err.message}`);
          process.exit(1);
        }
        console.log(data);
      });
    })
    .command("run <config>")
    .description("Execute project setup based on a config file")
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
        const engine = new execution_engine(operations, {
          logger,
        });
        await engine.execute(config);

        logger.info("Setup completed successfully!");
      } catch (error) {
        logger.info("Error during setup:", error.message);
        process.exit(1);
      }
      console.log("Access the log file for more details.", logger.logFileName);
    });

  program.showHelpAfterError();
  program.parse(process.argv);
}

main().catch(console.error);
