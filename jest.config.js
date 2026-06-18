module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  // The RN preset only transforms react-native core by default; the navigation
  // stack ships untranspiled TS/JSX and image assets, so whitelist it (and the
  // native libs it depends on) through the transformer.
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-navigation|react-native-gesture-handler|react-native-screens|react-native-safe-area-context)/)',
  ],
};
