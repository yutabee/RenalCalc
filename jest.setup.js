// Jest setup for component tests.

// react-native-gesture-handler ships native modules that need stubbing under Jest.
import 'react-native-gesture-handler/jestSetup';

// Silence "Animated: `useNativeDriver` is not supported" warnings and the
// lingering native-animation timers that otherwise fire after env teardown.
// (Path moved under src/private/ in RN 0.76.)
jest.mock('react-native/src/private/animated/NativeAnimatedHelper');
