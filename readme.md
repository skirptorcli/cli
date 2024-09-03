# Project Setup CLI

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Configuration File](#configuration-file)
6. [How It Works](#how-it-works)
7. [Adding New Operations](#adding-new-operations)
8. [Troubleshooting](#troubleshooting)
9. [Contributing](#contributing)

## Introduction

Project Setup CLI is a flexible and extensible command-line tool designed to automate project setup processes. It uses YAML configuration files to define setup steps, making it easy to create and share project templates across your team or the community.

Whether you're setting up a new web application, configuring a development environment, or initializing a complex project structure, this CLI tool can help streamline your workflow.

## Features

- **Configuration-driven**: Define your project setup steps in a simple YAML file.
- **Extensible**: Easily add new types of operations to suit your needs.
- **Dynamic**: Use template variables in your configuration for flexible setups.
- **Interactive**: Prompt users for input during the setup process.
- **Modular**: Well-organized code structure for easy maintenance and extension.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/skirptorcli/cli.git
   ```

2. Navigate to the project directory:
   ```
   cd cli
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Make the CLI globally accessible (optional):
   ```
   npm link
   ```

## Usage

To use the CLI, run:

```
skriptor <config-code>
```

For example:
```
skriptor create-expo-app
```

If you didn't make the CLI globally accessible, you can run it with:
```
node index.js <config-code>
```

## Configuration File

The configuration file is a YAML file that defines the steps for setting up your project. Here's a basic structure with emphasis on variable naming:

```yaml
project:
  name: Project Name
  description: Project Description

steps:
  - name: Ask for user's name
    type: ask_user
    question: What's your name?
    variable: username

  - name: Ask for project name
    type: ask_user
    question: What's the name of your project?
    variable: project_name

  - name: Create project directory
    type: create_directory
    path: ./{{user_input_project_name}}

  - name: Create README file
    type: create_file
    path: ./{{user_input_project_name}}/README.md
    content: |
      # {{user_input_project_name}}
      
      {{project.description}}
      
      Created by: {{user_input_username}}

  - name: Initialize git repository
    type: run_command
    command: git init
    cwd: ./{{user_input_project_name}}
```

Note the difference between defining and using variables:
- When defining a user input variable in an `ask_user` step, use a simple name like `username` or `project_name`.
- When using the variable later, prepend `user_input_` to it, like `{{user_input_username}}` or `{{user_input_project_name}}`.

This convention allows for clear categorization of variable types and makes it easy to distinguish user inputs from other types of variables in your configuration.

## How It Works

1. **Configuration Loading**: The CLI reads and parses the YAML configuration file.
2. **Operation Loading**: It dynamically loads available operations from the `operations/` directory.
3. **Execution**: The CLI goes through each step in the configuration:
   - It processes any template variables (like `{{user_input_project_name}}`).
   - It executes the corresponding operation for each step.
   - For `ask_user` steps, it prompts the user and stores the input for use in later steps.

## Adding New Operations

To add a new operation:

1. Create a new file in the `operations/` directory (e.g., `operations/my_new_operation.js`).
2. Export a function that takes two parameters: `step` and `context`.
3. Implement your operation logic in this function.

Example:
```javascript
// operations/log_message.js
module.exports = async function log_message(step, context) {
  console.log(step.message);
};
```

You can then use this operation in your configuration file:
```yaml
steps:
  - name: Log a message
    type: log_message
    message: Hello, {{user_input_username}}!
```

## Troubleshooting

- **Configuration file not found**: Make sure you're providing the correct path to your YAML configuration file.
- **Unknown operation type**: Check that the operation type in your configuration matches the filename in the `operations/` directory.
- **Template variables not working**: Ensure you're using the correct syntax: `{{user_input_variable_name}}` and that the variable is defined in an `ask_user` step.
- **Steps not executing in the expected order**: Review your configuration file and ensure the steps are in the correct order.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request