import {useEffect, useState} from 'react';
import {AccessibilityInfo} from 'react-native';

/**
 * Tracks the OS "Reduce Motion" accessibility setting. Components use it to
 * snap animations to their end state (setValue) instead of timing/spring, so
 * vestibular-sensitive users don't get the slide/scale motion.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then(value => {
      if (mounted) {
        setReduced(value);
      }
    });
    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduced,
    );
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  return reduced;
}
