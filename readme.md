# Skirptor CLI

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Configuration](#configuration)
6. [Operations](#operations)
7. [How It Works](#how-it-works)
8. [Environment Setup](#environment-setup)
9. [Adding New Operations](#adding-new-operations)
10. [Troubleshooting](#troubleshooting)
11. [Contributing](#contributing)

## Introduction

Skirptor CLI is a flexible and extensible command-line tool designed to automate project setup processes. It uses YAML configurations to define setup steps, making it easy to create and share project templates across your team or the community.

Whether you're setting up a new web application, configuring a development environment, or initializing a complex project structure, this CLI tool can help streamline your workflow.

## Features

- **Configuration-driven**: Define your project setup steps in a simple YAML format.
- **Server-based configurations**: Configurations are pulled from a server using a unique code.
- **Extensible**: Easily add new types of operations to suit your needs.
- **Dynamic**: Use template variables in your configuration for flexible setups.
- **Interactive**: Prompt users for input during the setup process.
- **Groq-powered**: Leverage Groq's Language Models for intelligent file updates.
- **Modular**: Well-organized code structure for easy maintenance and extension.

## Installation
   ```
   npm install -g skriptor
   ```

## Usage

## Usage

To use the CLI, run:

```

### Commands

- **run <config>**: Execute project setup based on a config file.
  - Example: `skirptor run ABC123`

- **view-logs <logFileName>**: View the specified log file.
  - Example: `skirptor view-logs setup.log`
skirptor <config-code>
```

For example:
```
skirptor ABC123
```

The `<config-code>` is a unique identifier for a configuration stored on the server. When you run the command, Skirptor will fetch the corresponding configuration from the server and execute it.

If you didn't make the CLI globally accessible, you can run it with:
```
node index.js <config-code>
```

## Configuration

The configuration is stored on the server and is retrieved using the provided config code. It's defined in YAML format and specifies the steps for setting up your project. Here's a basic structure:

```yaml
project:
  name: Project Name
  description: Project Description

steps:
  - name: Step Name
    type: operation_type
    # Additional fields based on operation type
```

To create or modify configurations, you'll need to use the server's interface or API. Consult your server documentation for details on managing configurations.

## Operations

### ask_user
Prompts the user for input.

```yaml
- name: Ask for project name
  type: ask_user
  question: What is the name of your project?
  variable: project_name
```

### create_directory
Creates a new directory.

```yaml
- name: Create project directory
  type: create_directory
  path: ./{{user_input_project_name}}
```

### create_file
Creates a new file with specified content.

```yaml
- name: Create README file
  type: create_file
  path: ./{{user_input_project_name}}/README.md
  content: |
    # {{user_input_project_name}}
    
    {{project.description}}
```

### update_file
Updates an existing file using Groq-powered natural language instructions.

```yaml
- name: Update README.md
  type: update_file
  path: ./{{user_input_project_name}}/README.md
  instructions: |
    Add a "How to contribute" section with the following steps:
    1. Fork the repository
    2. Create your feature branch
    3. Commit your changes
    4. Push to the branch
    5. Create a new Pull Request
```

### run_command
Executes a shell command.

```yaml
- name: Initialize git repository
  type: run_command
  command: git init
  cwd: ./{{user_input_project_name}}
```
### clone_repository
Clones a Git repository to a specified destination.

```yaml
- name: Clone repository
  type: clone_repository
  repository_url: https://github.com/user/repo.git
  destination: ./local_directory
```

The `destination` field is optional. If not provided, the repository will be cloned into a directory named after the repository.

## How It Works

1. The CLI receives a config code as an argument.
2. It sends a request to the server to fetch the corresponding YAML configuration.
3. The CLI parses the retrieved YAML configuration.
4. It dynamically loads available operations from the `operations/` directory.
5. The CLI executes each step in the configuration:
   - It processes any template variables (like `{{user_input_project_name}}`).
   - It executes the corresponding operation for each step.
   - For `ask_user` steps, it prompts the user and stores the input for use in later steps.
   - For `update_file` steps, it uses Groq's language model to intelligently update the file based on the provided instructions.

## Environment Setup

To use Skirptor CLI, you need to set up your environment:

1. Set the `SKIRPTOR_SERVER_URL` environment variable with the URL of your configuration server:
   ```
   export SKIRPTOR_SERVER_URL=https://your-skirptor-server.com
   ```
   For Windows, use:
   ```
   set SKIRPTOR_SERVER_URL=https://your-skirptor-server.com
   ```

2. To use the Groq-powered `update_file` operation, sign up for a Groq account at https://console.groq.com/ and obtain an API key. Then set the `GROQ_API_KEY` environment variable:
   ```
   export GROQ_API_KEY=your_api_key_here
   ```
   For Windows, use:
   ```
   set GROQ_API_KEY=your_api_key_here
   ```

3. Tos use the OPEN AI powered `update_file`.
   ```
   export OPEN_AI_API_KEY=your_api_key_here
   ```
   For Windows, use:
   ```
   set OPEN_AI_API_KEY=your_api_key_here
   ```


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

- **Configuration not found**: Make sure you're using a valid configuration code. Check with your server administrator if you're unsure about the available codes.
- **Server connection issues**: Ensure that the `SKIRPTOR_SERVER_URL` is correctly set and that you have an active internet connection.
- **Unknown operation type**: Check that the operation type in your configuration matches the filename in the `operations/` directory.
- **Template variables not working**: Ensure you're using the correct syntax: `{{user_input_variable_name}}` and that the variable is defined in an `ask_user` step.
- **Groq update not working as expected**: Review the update instructions and ensure they are clear and specific. You may need to adjust the Groq prompt or add more context to get the desired results.
- **Groq API errors**: Ensure your `GROQ_API_KEY` is correctly set and that you have an active Groq subscription. Check the error message for details on API call failures.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
