# Node.js Logger

This is a simple, flexible logging service for Node.js applications. It supports logging to both console and file, with customizable log levels, log file names, and unique log IDs for easy tracking of issues.

## Features

- Four log levels: error, warn, info, and debug
- Option to log to console and/or file
- Customizable log directory
- Option for a single log file or separate files for each log level
- Timestamp for each log entry
- Unique ID for each log entry

## Installation

1. Save the `logger.js` file in your project directory.
2. Require the logger in your Node.js application:

```javascript
const Logger = require('./logger');
```

## Usage

### Basic Usage

```javascript
const Logger = require('./logger');

const logger = new Logger();

logger.info('Application started');
const debugId = logger.debug('Debugging information');
const warnId = logger.warn('Warning: resource usage high');
const errorId = logger.error('Error: database connection failed');

console.log(`Debug log ID: ${debugId}`);
console.log(`Warning log ID: ${warnId}`);
console.log(`Error log ID: ${errorId}`);
```

### Advanced Usage

You can customize the logger by passing options to the constructor:

```javascript
const logger = new Logger({
  logDir: 'app_logs',
  logLevel: 'debug',
  logToConsole: true,
  logToFile: true,
  logFileName: 'application.log'
});
```

### Configuration Options

- `logDir` (string): Directory to store log files. Default: 'logs'
- `logLevel` (string): Minimum log level to record. Default: 'info'
- `logToConsole` (boolean): Whether to log to console. Default: true
- `logToFile` (boolean): Whether to log to file. Default: true
- `logFileName` (string): Custom log file name. If null, separate files are created for each log level. Default: null

### Log Levels

The logger supports four log levels, in order of increasing verbosity:

1. error
2. warn
3. info
4. debug

Only messages at the configured `logLevel` or below (more severe) will be logged.

### Unique Log IDs

Each log entry is assigned a unique ID. This ID is returned by the logging methods and is included in the log message. You can use this ID to track specific issues or log entries.

## Examples

### Logging with Unique IDs

```javascript
const logger = new Logger();

const infoId = logger.info('This is an info message');
const errorId = logger.error('This is an error message');

console.log(`Info log ID: ${infoId}`);
console.log(`Error log ID: ${errorId}`);
```

### Logging to a single file

```javascript
const logger = new Logger({
  logFileName: 'application.log'
});

logger.info('This is an info message');
logger.error('This is an error message');
// Both messages will be logged to 'logs/application.log' with unique IDs
```

### Logging to separate files for each level

```javascript
const logger = new Logger();

logger.info('This is an info message');
logger.error('This is an error message');
// The info message will be logged to 'logs/info.log'
// The error message will be logged to 'logs/error.log'
// Both will have unique IDs
```

### Changing the log level

```javascript
const logger = new Logger({ logLevel: 'warn' });

logger.info('This message will not be logged');
const warnId = logger.warn('This warning will be logged');
const errorId = logger.error('This error will be logged');

console.log(`Warning log ID: ${warnId}`);
console.log(`Error log ID: ${errorId}`);
```

## Contributing

Feel free to submit issues or pull requests if you have suggestions for improvements or find any bugs.

## License

This project is open source and available under the [MIT License](LICENSE).