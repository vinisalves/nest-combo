# NestJS Combo CLI

![npm](https://img.shields.io/npm/v/nest-combo) ![npm](https://img.shields.io/npm/dt/nest-combo)

A CLI tool to generate NestJS Projects, modules, controllers, services, and other components in a single line command.

---

## Table of Contents

- [How it works](#how-it-works)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

---

## How It Works

### How Nest-Combo Works with NestJS CLI

If you have the **NestJS CLI** installed globally, **nest-combo** will automatically detect and use it to execute commands. This ensures compatibility with your existing global setup.

If the NestJS CLI is not installed globally, don't worry! **nest-combo** comes bundled with its own local version of the NestJS CLI. It will seamlessly fall back to this cached version to ensure smooth operation without requiring any additional setup from you.

---

## Features

- Load a full project from a YAML file.
- Create a new project and automatically open VsCode
- Generate NestJS modules, controllers, services, gateways, middleware, and interceptors with a single-line command.
- Support for optional flags like `--no-spec` and `--dry-run`.
- Colorful and user-friendly output using `chalk`.
- Easy-to-use command-line interface.

---

## Installation

Install the package globally using npm:

```bash
npm install -g nest-combo
```

Verify the installation by checking the version:

```bash
nest-combo --version
```

---

## Usage

Run the CLI tool with the desired module name and options:

```bash
nest-combo <<project|module>-name> [options]
```

### Example Commands

#### Create a project

```bash
nest-combo my-amazing-project -new # "VSCode will open by default once it's done. If you don't want it just add -no-vscode"
```

#### Create a Module, Controller, Service, Intercepetor, Gateway and Middleware in a Single Line Command

```bash
nest-combo users -m -c -s -itc -g -mw # if you don't want spcec files, just add -ns or --no-spec
```

#### Create a Full Project from a YAML File

```bash
nest-combo -f project.yml
```

---

## Options

| Flag                  | Description                                                    |
| --------------------- | -------------------------------------------------------------- |
| `-m, --module`        | Generate a module                                              |
| `-c, --controller`    | Generate a controller                                          |
| `-s, --service`       | Generate a service                                             |
| `-g, --gateway`       | Generate a gateway                                             |
| `-mw, --middleware`   | Generate middleware                                            |
| `-itc, --interceptor` | Generate an interceptor                                        |
| `-ns, --no-spec`      | Do not generate `.spec.ts` test files                          |
| `-dr, --dry-run`      | Report actions that would be taken without writing out results |
| `-f, --file`          | Create a project from a YAML file                              |

---

### YAML Example for Loading a Full Project from Scratch

```yaml
# YML example for loading a full project from scratch
nest-combo:
  project-name: my-new-project
  open-vscode: true # Open VSCode when the process is finished
  package-manager: npm # npm | yarn | pnpm
  dependencies:
    - '@nestjs/config'
    - '@nestjs/bull'
    - 'class-transformer'
    - 'class-validator'
    - 'nestjs-twilio'
  modules:
    - name: core
      resources:
        - module
      modules:
        - name: user
          resources:
            - module
            - controller
            - service
          options:
            - --no-spec
          modules:
            - name: subUsers
              resources:
                - module
                - controller
                - service
              options:
                - --no-spec
        - name: auth
          resources:
            - module
            - controller
            - service
            - interceptor
    - name: product
      resources:
        - module
        - controller
        - service
    - name: payment
      resources:
        - module
        - controller
        - service
```

---

## Contributing

We welcome contributions! Here’s how you can help:

1. **Fork the repository** and clone it locally.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and ensure everything works as expected.
4. Commit your changes with a clear message:
   ```bash
   git commit -m "Add feature: description of your changes"
   ```
5. Push your branch to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Open a pull request on GitHub.

### Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Test your changes locally:
   ```bash
   npm link
   nest-combo users -m -c -s
   ```

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Built with ❤️ using [NestJS](https://nestjs.com/) and [Chalk](https://github.com/chalk/chalk).
- Inspired by the need for a faster and more efficient way to scaffold NestJS projects.

---

Feel free to customize this `README.md` further to match your project's specific details or add additional sections (e.g., FAQs, roadmap). Let me know if you need any modifications! 🚀
