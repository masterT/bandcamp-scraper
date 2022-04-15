/* eslint-env node */

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    'prettier/prettier': 2
  },
  ignorePatterns: [
    'node_modules/',
    'bin/**/*',
    'dist/**/*',
    'docs/**/*',
    'coverage/**/*'
  ]
};
