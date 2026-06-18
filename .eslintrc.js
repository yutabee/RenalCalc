module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      // Jest setup runs in the test environment but isn't matched by the
      // default test-file globs.
      files: ['jest.setup.js'],
      env: {jest: true},
    },
  ],
};
