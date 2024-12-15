import React from 'react';
import {View, Text, TextInput, StyleSheet, TextInputProps} from 'react-native';

interface InputFieldProps extends TextInputProps {
  label: string;
  unit: string;
}

const COLORS = {
  primary: '#1B2B4B',
  text: {
    primary: '#1A1A1A',
    secondary: '#6B7280',
    placeholder: '#A0A0A0',
  },
  background: '#F5F5F5',
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  unit,
  ...props
}) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.text.placeholder}
          keyboardType="numeric"
          {...props}
        />
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 17,
    color: COLORS.text.primary,
    height: 52,
    paddingRight: 48,
  },
  unit: {
    position: 'absolute',
    right: 16,
    top: 16,
    color: COLORS.text.secondary,
    fontSize: 15,
  },
});

export default InputField;
