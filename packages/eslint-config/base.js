/** @type {import("eslint").Linter.Config} */
const turboConfig = require('eslint-config-turbo').default;
console.log(turboConfig);
module.exports = {
  root: true,
  ...turboConfig,
  extends: [
    ...(turboConfig?.extends || []),
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: [
    ...(turboConfig?.plugins || []),
    '@typescript-eslint/eslint-plugin',
    'react-hooks',
    'eslint-plugin-import-helpers',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  // ignorePatterns: [
  //   '.*.js',
  //   '*.setup.js',
  //   '*.config.js',
  //   '.turbo/',
  //   'dist/',
  //   'coverage/',
  //   'node_modules/',
  //   '.husky/',
  // ],
};
