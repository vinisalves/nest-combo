const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

describe('CLI End-to-End Tests', () => {
  const projectName = 'test-project';

  beforeAll(() => {
    execSync('npm link', { cwd: process.cwd() });

    if (fs.existsSync(projectName)) {
      execSync(`rm -rf ${projectName}`);
    }
  });

  afterAll(() => {
    if (fs.existsSync(projectName)) {
      execSync(`rm -rf ${projectName}`);
    }
  });

  it('should create a new project', () => {
    if (fs.existsSync(projectName)) {
      execSync(`rm -rf ${projectName}`);
    }
    execSync(`nest-combo ${projectName} -new -no-vscode`).toString();

    expect(fs.existsSync(projectName)).toBe(true);
  });

  it('should generate resources (module, controller, service, gateway, interceptor and middleware)', () => {
    const output = execSync(`nest-combo users -m -c -s -g -itc -mw`, {
      cwd: projectName,
    }).toString();

    expect(output).toContain('Generating module for users');
    expect(output).toContain('Generating controller for users');
    expect(output).toContain('Generating service for users');

    const moduleFile = path.join(
      projectName,
      'src',
      'users',
      'users.module.ts',
    );
    const controllerFile = path.join(
      projectName,
      'src',
      'users',
      'users.controller.ts',
    );
    const serviceFile = path.join(
      projectName,
      'src',
      'users',
      'users.service.ts',
    );
    const gatewayFile = path.join(
      projectName,
      'src',
      'users',
      'users.gateway.ts',
    );
    const interceptorFile = path.join(
      projectName,
      'src',
      'users',
      'users.interceptor.ts',
    );
    const middlewareFile = path.join(
      projectName,
      'src',
      'users',
      'users.middleware.ts',
    );

    expect(fs.existsSync(moduleFile)).toBe(true);
    expect(fs.existsSync(controllerFile)).toBe(true);
    expect(fs.existsSync(serviceFile)).toBe(true);
    expect(fs.existsSync(gatewayFile)).toBe(true);
    expect(fs.existsSync(interceptorFile)).toBe(true);
    expect(fs.existsSync(middlewareFile)).toBe(true);

    if (fs.existsSync(projectName)) {
      execSync(`rm -rf ${projectName}`);
    }
  });

  it('should load a full project from a YAML file', () => {
    if (fs.existsSync(projectName)) {
      execSync(`rm -rf ${projectName}`);
    }

    const ymlFileContent = `
nest-combo:
  project-name: test-project
  package-manager: npm 
  dependencies:
    - "@nestjs/config"    
    - "@nestjs/bull"
    - "class-transformer"
    - "class-validator"
    - "nestjs-twilio"
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
    `;

    const yamlFilePath = path.resolve(`./test/${projectName}.yml`);
    fs.writeFileSync(yamlFilePath, ymlFileContent);

    const command = `nest-combo -f ${yamlFilePath}`;
    const output = execSync(command).toString();

    expect(fs.existsSync(projectName)).toBe(true);

    expect(output).toContain('Generating project');
    expect(output).toContain('Installing dependencies');
    expect(output).toContain('Generating module for core');
    expect(output).toContain('Generating module for core/user');
    expect(output).toContain('Generating controller for core/user');
    expect(output).toContain('Generating service for core/user');

    fs.unlinkSync(yamlFilePath);
  });
});
