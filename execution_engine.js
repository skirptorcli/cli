const Handlebars = require("handlebars");

class execution_engine {
  constructor(operations) {
    this.operations = operations;
    this.context = { user_input: {} };
  }

  async execute(config) {
    this.context.project = config.project;

    for (const step of config.steps) {
      console.log(`Executing step: ${step.name}`);
      await this.execute_step(step);
    }
  }

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

module.exports = execution_engine;
