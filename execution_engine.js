/**
 * ExecutionEngine class is responsible for executing a series of operations
 * defined in a configuration file. It uses Handlebars for templating and
 * supports dynamic user input and utility functions.
 */
const Handlebars = require("handlebars");

class ExecutionEngine {
  /**
   * Constructs an instance of ExecutionEngine.
   * @param {Object} operations - A map of operation names to their implementation functions.
   * @param {Object} utils - Utility functions and objects, including a logger.
   */
  constructor(operations, utils) {
    this.operations = operations;
    this.context = { user_input: {}, utils };
  }
  }

  /**
   * Executes the steps defined in the configuration.
   * @param {Object} config - The configuration object containing project details and steps.
   */
  async execute(config) {
    this.context.project = config.project;

    for (const step of config.steps) {
      this.context.utils.logger.info(`Executing step: ${step.name}`);
      await this.execute_step(step);
    }
  }

  /**
   * Executes a single step in the configuration.
   * @param {Object} step - The step object containing details of the operation to execute.
   * @throws Will throw an error if the operation type is unknown.
   */
  async execute_step(step) {
    const compiled_step = this.compile_step(step);
    const operation = this.operations[compiled_step.type];

    if (!operation) {
      throw new Error(`Unknown operation type: ${compiled_step.type}`);
    }

    const result = await operation(compiled_step, this.context);

    if (compiled_step.type === "ask_user") {
      this.context.user_input[compiled_step.variable] = result;
    }
  }

  /**
   * Flattens a nested object into a single-level object with underscore-separated keys.
   * @param {Object} obj - The object to flatten.
   * @returns {Object} - The flattened object.
   */
  object_flatten(obj) {
    const flattened = {};

    function recurse(current, prefix = "") {
      for (const key in current) {
        if (
          typeof current[key] === "object" &&
          current[key] !== null &&
          !Array.isArray(current[key])
        ) {
          recurse(current[key], `${prefix}${key}_`);
        } else {
          flattened[`${prefix}${key}`] = current[key];
        }
      }
    }

    recurse(obj);
    return flattened;
  }
  /**
   * Compiles a step by processing its template strings using Handlebars.
   * @param {Object} step - The step object to compile.
   * @returns {Object} - The compiled step with all template strings processed.
   */
  compile_step(step) {
    return Object.entries(step).reduce((acc, [key, value]) => {
      if (typeof value === "string") {
        const template = Handlebars.compile(value);
        const context = this.object_flatten(this.context);
        acc[key] = template(this.object_flatten(context));
      } else if (typeof value === "object" && value !== null) {
        acc[key] = this.compile_step(value);
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});
  }
}

module.exports = ExecutionEngine;
