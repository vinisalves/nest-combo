const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

describe('CLI End-to-End Tests', () => {
  const tmpDir = path.resolve('./tmp');
  const projectName = 'test-project';
  const projectNameYaml = 'test-project-yaml';

  beforeAll(() => {
    execSync('npm link', { cwd: process.cwd() });

    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    const projectDir = path.join(tmpDir, projectName);
    const projectYamlDir = path.join(tmpDir, projectNameYaml);

    if (fs.existsSync(projectDir)) execSync(`rm -rf ${projectDir}`);
    if (fs.existsSync(projectYamlDir)) execSync(`rm -rf ${projectYamlDir}`);
  });

  afterAll(() => {
    if (fs.existsSync(tmpDir)) {
      execSync(`rm -rf ${tmpDir}`);
    }
  });

  it('should create a new project', () => {
    execSync(`nest-combo ${projectName} -new -no-vscode`, {
      cwd: tmpDir,
    }).toString();

    expect(fs.existsSync(path.join(tmpDir, projectName))).toBe(true);
  });

  it('should load a full project from a YAML file', () => {
    const ymlFileContent = `
nest-combo:
  project-name: test-project-yaml
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

    const yamlFilePath = path.join(tmpDir, `${projectNameYaml}.yml`);
    fs.writeFileSync(yamlFilePath, ymlFileContent);

    const output = execSync(`nest-combo -f ${yamlFilePath}`, {
      cwd: tmpDir,
    }).toString();

    expect(fs.existsSync(path.join(tmpDir, projectNameYaml))).toBe(true);

    fs.unlinkSync(yamlFilePath);
  });

  it('should generate resources (module, controller, service, gateway, interceptor and middleware)', () => {
    const projectDir = path.join(tmpDir, projectName);

    const output = execSync(`nest-combo users -m -c -s -g -itc -mw`, {
      cwd: projectDir,
    }).toString();

    expect(output).toContain('Generating module for users');

    const usersDir = path.join(projectDir, 'src', 'users');

    const expectedFiles = [
      'users.module.ts',
      'users.controller.ts',
      'users.service.ts',
      'users.gateway.ts',
      'users.interceptor.ts',
      'users.middleware.ts',
    ];

    expectedFiles.forEach((file) => {
      expect(fs.existsSync(path.join(usersDir, file))).toBe(true);
    });
  });

  it('should generate API resources', () => {
    const projectDir = path.join(tmpDir, projectName);

    const output = execSync(`nest-combo auth -a`, {
      cwd: projectDir,
    }).toString();

    expect(output).toContain('Generating api for auth');

    const authDir = path.join(projectDir, 'src', 'auth');

    ['auth.module.ts', 'auth.controller.ts', 'auth.service.ts'].forEach(
      (file) => expect(fs.existsSync(path.join(authDir, file))).toBe(true),
    );
  });
});
