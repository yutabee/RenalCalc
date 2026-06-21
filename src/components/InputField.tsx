import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  Easing,
  TextInputProps,
} from 'react-native';
import {colors, radius, spacing, typography} from '../theme';
import {useReducedMotion} from '../hooks/useReducedMotion';

interface InputFieldProps extends TextInputProps {
  label: string;
  unit: string;
  /** Inline validation message shown under the field; also flags the border. */
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  unit,
  error,
  onFocus,
  onBlur,
  ...props
}) => {
  const hasError = Boolean(error);
  const [isFocused, setIsFocused] = useState(false);
  const reduceMotion = useReducedMotion();
  // 0 -> rest, 1 -> focused. Drives the soft 120ms border colour fade.
  const focusAnim = useRef(new Animated.Value(0)).current;

  const animateFocus = useCallback(
    (toValue: number) => {
      if (reduceMotion) {
        focusAnim.setValue(toValue);
        return;
      }
      Animated.timing(focusAnim, {
        toValue,
        duration: 120,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false, // borderColor is not supported by the native driver
      }).start();
    },
    [focusAnim, reduceMotion],
  );

  // Stop any in-flight border animation if the field unmounts mid-transition.
  useEffect(() => () => focusAnim.stopAnimation(), [focusAnim]);

  const handleFocus = useCallback<NonNullable<TextInputProps['onFocus']>>(
    e => {
      setIsFocused(true);
      animateFocus(1);
      onFocus?.(e);
    },
    [animateFocus, onFocus],
  );

  const handleBlur = useCallback<NonNullable<TextInputProps['onBlur']>>(
    e => {
      setIsFocused(false);
      animateFocus(0);
      onBlur?.(e);
    },
    [animateFocus, onBlur],
  );

  // Error always wins; otherwise interpolate rest -> accent on focus.
  const animatedBorderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.accent],
  });
  const borderColor = hasError ? colors.danger : animatedBorderColor;

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <Animated.View
          style={[
            styles.well,
            isFocused && !hasError && styles.wellFocused,
            hasError && styles.wellError,
            {borderColor},
          ]}>
          <TextInput
            style={styles.input}
            placeholderTextColor={colors.text.placeholder}
            keyboardType="numeric"
            accessibilityLabel={label}
            accessibilityHint={`単位は${unit}`}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          <Text style={styles.unit}>{unit}</Text>
        </Animated.View>
      </View>
      {hasError && (
        <Text style={styles.errorText} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.label,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  inputContainer: {
    position: 'relative',
  },
  // Tier-0 sunken well: inputBg fill + visible 1px border at rest, no shadow.
  well: {
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    height: 52,
    justifyContent: 'center',
  },
  // Soft 2px ring feel on focus (accent border colour set via animation).
  wellFocused: {
    borderWidth: 2,
  },
  wellError: {
    backgroundColor: colors.dangerWash,
    borderWidth: 2, // error ring is at least as prominent as the focus ring
  },
  input: {
    ...typography.inputValue,
    fontVariant: ['tabular-nums'],
    color: colors.text.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 0,
    paddingRight: 48,
    height: '100%',
  },
  unit: {
    position: 'absolute',
    right: spacing.md,
    top: 0,
    bottom: 0,
    textAlignVertical: 'center',
    ...typography.data,
    lineHeight: 52,
    color: colors.text.secondary,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.sm,
  },
});

export default InputField;
