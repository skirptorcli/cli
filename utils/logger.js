const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

/**
 * Logger class for handling application logs.
 * Supports console and file logging with customizable log levels and unique log IDs.
 */
class Logger {
  /**
   * Create a new Logger instance.
   * @param {Object} options - Configuration options for the logger.
   * @param {string} [options.logDir='logs'] - Directory to store log files.
   * @param {string} [options.logLevel='info'] - Minimum log level to record.
   * @param {boolean} [options.logToConsole=true] - Whether to log to console.
   * @param {boolean} [options.logToFile=true] - Whether to log to file.
   * @param {string} [options.logFileName=null] - Custom log file name. If null, separate files are created for each log level.
   */
  constructor(options = {}) {
    this.logDir = options.logDir || "logs";
    this.logLevel = options.logLevel || "info";
    this.logToConsole = options.logToConsole !== false;
    this.logToFile = options.logToFile !== false;
    this.logFileName = options.logFileName || null;

    // Define log levels and their priority
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };

    // Create log directory if it doesn't exist
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
    }
  }

  /**
   * Generate a unique ID for the log entry.
   * @returns {string} A unique ID.
   */
  generateUniqueId() {
    return crypto.randomBytes(8).toString("hex");
  }

  /**
   * Log a message with the specified log level.
   * @param {string} level - The log level ('error', 'warn', 'info', or 'debug').
   * @param {string} message - The message to log.
   * @returns {string} The unique ID of the log entry.
   */
  log(level, message) {
    // Check if the log level is sufficient to record this message
    if (this.levels[level] <= this.levels[this.logLevel]) {
      const uniqueId = this.generateUniqueId();
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] [${level.toUpperCase()}] [${uniqueId}] ${message}`;

      // Log to console if enabled
      if (this.logToConsole) {
        console.log(logMessage);
      }

      // Log to file if enabled
      if (this.logToFile) {
        let filePath;
        if (this.logFileName) {
          // Use custom log file name if provided
          filePath = path.join(this.logDir, this.logFileName);
        } else {
          // Use separate files for each log level
          const fileName = `${level}.log`;
          filePath = path.join(this.logDir, fileName);
        }
        fs.appendFileSync(filePath, logMessage + "\n");
      }

      return uniqueId;
    }
    return null;
  }

  /**
   * Log an error message.
   * @param {string} message - The error message to log.
   * @returns {string} The unique ID of the log entry.
   */
  error(message) {
    return this.log("error", message);
  }

  /**
   * Log a warning message.
   * @param {string} message - The warning message to log.
   * @returns {string} The unique ID of the log entry.
   */
  warn(message) {
    return this.log("warn", message);
  }

  /**
   * Log an info message.
   * @param {string} message - The info message to log.
   * @returns {string} The unique ID of the log entry.
   */
  info(message) {
    return this.log("info", message);
  }

  /**
   * Log a debug message.
   * @param {string} message - The debug message to log.
   * @returns {string} The unique ID of the log entry.
   */
  debug(message) {
    return this.log("debug", message);
  }
}

module.exports = Logger;
