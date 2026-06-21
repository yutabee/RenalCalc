import React from 'react';
import {View, Text, TextInput, StyleSheet, TextInputProps} from 'react-native';
import {colors, radius, spacing, typography} from '../theme';

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
  ...props
}) => {
  const hasError = Boolean(error);
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, hasError && styles.inputError]}
          placeholderTextColor={colors.text.placeholder}
          keyboardType="numeric"
          accessibilityLabel={label}
          accessibilityHint={`単位は${unit}`}
          {...props}
        />
        <Text style={styles.unit}>{unit}</Text>
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
    marginBottom: spacing.sm,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 4,
    fontSize: 17,
    color: colors.text.primary,
    height: 52,
    paddingRight: 48,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: '#FCEDEE',
  },
  unit: {
    position: 'absolute',
    right: spacing.md,
    top: 16,
    color: colors.text.secondary,
    fontSize: 15,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.xs + 2,
  },
});

export default InputField;
