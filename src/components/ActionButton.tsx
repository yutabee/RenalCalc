import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {ActionButtonProps} from '../types/interfaces';
import {styles} from '../styles';

export const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  backgroundColor,
}) => (
  <TouchableOpacity
    style={[
      styles.actionButton,
      variant === 'secondary' && styles.actionButtonSecondary,
      variant === 'tertiary' && styles.actionButtonTertiary,
      backgroundColor && {backgroundColor},
    ]}
    onPress={onPress}
    activeOpacity={0.7}>
    <Text
      style={[
        styles.actionButtonText,
        variant === 'secondary' && styles.actionButtonTextSecondary,
        variant === 'tertiary' && styles.actionButtonTextTertiary,
      ]}>
      {title}
    </Text>
  </TouchableOpacity>
);
