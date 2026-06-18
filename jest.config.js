module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  // The RN preset only transforms react-native core by default; the navigation
  // stack ships untranspiled TS/JSX and image assets, so whitelist it (and the
  // native libs it depends on) through the transformer.
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-navigation|react-native-gesture-handler|react-native-screens|react-native-safe-area-context)/)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/types/**',
    '!src/styles.ts',
    '!src/**/index.ts',
  ],
  // Regression floor (current global is ~76% stmts / 80% branch). The
  // safety-critical calculation module is locked at 100%.
  coverageThreshold: {
    global: {statements: 70, branches: 70, functions: 55, lines: 70},
    './src/utils/calculations.ts': {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
};
