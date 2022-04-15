/* eslint-env node */

/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
module.exports = {
  // Automatically clear mock calls, instances and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,

  // A preset that is used as a base for Jest's configuration
  preset: 'ts-jest',

  // The regexp pattern or array of patterns that Jest uses to detect test files
  testRegex: '/integration/'
};
