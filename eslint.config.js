const rnConfig = require('@react-native/eslint-config/flat');
const globals = require('globals');

// ESLint flat config (ESLint v9+). Replaces the legacy .eslintrc.js /
// .eslintignore. Uses React Native's official flat config export.
module.exports = [
  {
    ignores: ['coverage/**'],
  },
  ...rnConfig,
  {
    // This is a TypeScript project (no Flow). RN's config enables two ft-flow
    // rules, but the pinned eslint-plugin-ft-flow@2 calls context.getAllComments
    // — removed in ESLint v9 — and crashes when it runs (e.g. on plain .js
    // config files). We don't lint Flow, so turn them off.
    rules: {
      'ft-flow/define-flow-type': 'off',
      'ft-flow/use-flow-type': 'off',
    },
  },
  {
    // Jest setup runs in the test environment but isn't matched by the
    // default test-file globs.
    files: ['jest.setup.js'],
    languageOptions: {globals: {...globals.jest}},
  },
];
