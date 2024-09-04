#!/usr/bin/env node
/**
 * This script serves as the entry point for the Skriptor CLI tool.
 * It loads environment variables, parses command-line arguments, executes
 * project setup based on a specified configuration file, and uploads logs for debugging.
 */

require("dotenv").config();
const path = require("path");
const fs = require("fs").promises;
const { program } = require("commander");
const config_loader = require("./config_loader");
const operation_loader = require("./operation_loader");
const execution_engine = require("./execution_engine");
const Logger = require("./utils/logger");
const uploadLog = require("./utils/upload-log");
const { LogStatus } = require("./utils/constant");

/**
 * Displays available commands in a table format.
 */
function displayCommands() {
  const commands = program.commands
    .filter((cmd) => cmd.name() !== "*")
    .map((cmd) => ({
      Command: cmd.name(),
      Parameters: cmd.usage().replace(cmd.name(), "").trim(),
      Description: cmd.description(),
    }));

  console.log("\nAvailable commands:");
  console.table(commands);
}

/**
 * Main function to execute the Skriptor CLI tool.
 * It sets up the command-line interface, loads configurations and operations,
 * and executes the setup process or views logs.
 */
async function main() {
  program
    .name("skriptor")
    .description("CLI to execute project setup or view logs")
    .version("1.0.0");

  program
    .command("run <config>")
    .description("Execute project setup based on a config file")
    .action(async (config) => {
      const universalTimeInMilliseconds = new Date().getTime();
      const logFileName = `${path.basename(
        config,
        path.extname(config)
      )}-${universalTimeInMilliseconds}.log`;
      const logFilePath = path.join(path.dirname(config), logFileName);
      const logger = new Logger({
        logDir: path.dirname(config),
        logToConsole: true,
        logToFile: true,
        logFileName: logFileName,
      });

      try {
        // Load configuration
        const configData = await config_loader.load(config, logger);

        // Load operations
        const operations = await operation_loader.load_operations(
          path.join(__dirname, "operations")
        );

        // Execute configuration
        const engine = new execution_engine(operations, { logger });
        await engine.execute(configData);

        logger.info("Setup completed successfully!");

        // Upload log file in the background
        try {
          await uploadLog(logFilePath, config, LogStatus.SUCCESS);
          logger.info("Log file uploaded successfully.");
        } catch (uploadError) {
          logger.error("Failed to upload log file:", uploadError.message);
        }
      } catch (error) {
        logger.error("Error during setup:", error.message);

        // Attempt to upload log file even if there was an error
        try {
          await uploadLog(logFilePath, config, LogStatus.FAILURE);
          logger.info("Log file uploaded successfully despite setup error.");
        } catch (uploadError) {
          logger.error(
            "Failed to upload log file after setup error:",
            uploadError.message
          );
        }

        process.exit(1);
      }

      console.log(
        "Access the log file for more details:",
        `skriptor view-logs ${config} ${logFileName}`
      );
    });

  program
    .command("view-logs <config> <logFileName>")
    .description("View the specified log file")
    .action(async (config, logFileName) => {
      const logFilePath = path.join(path.dirname(config), logFileName);
      try {
        const data = await fs.readFile(logFilePath, "utf8");
        console.log("\nLog contents:");
        console.log("─".repeat(process.stdout.columns));
        console.log(data);
        console.log("─".repeat(process.stdout.columns));
      } catch (error) {
        console.error(`Error reading log file: ${error.message}`);
        process.exit(1);
      }
    });

  // Add a fallback command for invalid or missing commands
  program.command("*", { noHelp: true }).action(() => {
    console.log("Invalid command.");
    displayCommands();
    process.exit(1);
  });

  // Show help if no arguments are provided
  if (process.argv.length === 2) {
    displayCommands();
    process.exit(0);
  }

  program.parse(process.argv);
}

main().catch(console.error);
