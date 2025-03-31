import {
  generateModule,
  generateController,
  generateService,
  generateInterceptor,
  generateGateway,
  generateMiddlware,
} from './generate.js';

/**
 * An array of resource configurations used to define NestJS components
 * such as modules, controllers, services, gateways, middleware, and interceptors.
 *
 * Each configuration object contains the following properties:
 * @typedef {Object} ResourceConfig
 * @property {string} name - The name of the resource (e.g., "module", "controller").
 * @property {string} flag - The short flag used in the CLI command (e.g., "-m" for module).
 * @property {string} longFlag - The long flag used in the CLI command (e.g., "--module" for module).
 * @property {Function} generator - The function responsible for generating the resource.
 *
 * This array is used to dynamically generate resources based on user input.
 * Each `generator` function is imported from the `./generate.js` file and corresponds
 * to a specific NestJS component.
 */
export default [
  {
    name: 'module',
    flag: '-m',
    longFlag: '--module',
    generator: generateModule,
  },
  {
    name: 'controller',
    flag: '-c',
    longFlag: '--controller',
    generator: generateController,
  },
  {
    name: 'service',
    flag: '-s',
    longFlag: '--service',
    generator: generateService,
  },
  {
    name: 'gateway',
    flag: '-g',
    longFlag: '--gateway',
    generator: generateGateway,
  },
  {
    name: 'middleware',
    flag: '-mw',
    longFlag: '--middleware',
    generator: generateMiddlware,
  },
  {
    name: 'interceptor',
    flag: '-itc',
    longFlag: '--interceptor',
    generator: generateInterceptor,
  },
];
