import React, {useRef} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Animated,
  Easing,
} from 'react-native';
import {colors} from '../theme';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  backgroundColor?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

const COLORS = {
  primary: colors.primary,
  primaryLight: colors.primaryDark,
  white: colors.text.onPrimary,
  transparent: 'transparent',
  disabled: colors.border,
  disabledText: colors.text.placeholder,
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  backgroundColor,
  disabled = false,
  loading = false,
  icon,
  size = 'medium',
}) => {
  // スケールアニメーション用のAnimated Value（再レンダーで作り直さない）
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnimation, {
      toValue: 0.95,
      duration: 150,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnimation, {
      toValue: 1,
      duration: 150,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const buttonStyles = [
    styles.button,
    styles[size],
    variant === 'primary' && styles.primaryButton,
    variant === 'secondary' && styles.secondaryButton,
    variant === 'tertiary' && styles.tertiaryButton,
    disabled && styles.disabledButton,
    backgroundColor && {backgroundColor},
  ];

  const textStyles = [
    styles.text,
    styles[`${size}Text`],
    variant === 'primary' && styles.primaryText,
    variant === 'secondary' && styles.secondaryText,
    variant === 'tertiary' && styles.tertiaryText,
    disabled && styles.disabledText,
  ];

  const animatedStyle = {
    transform: [{scale: scaleAnimation}],
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={buttonStyles}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityState={{
          disabled: disabled || loading,
        }}>
        {loading ? (
          <ActivityIndicator
            color={variant === 'primary' ? COLORS.white : COLORS.primary}
            size="small"
          />
        ) : (
          <View style={styles.contentContainer}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={textStyles}>{title}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  // サイズバリエーション
  small: {
    height: 40,
    paddingHorizontal: 16,
  },
  medium: {
    height: 56,
    paddingHorizontal: 24,
  },
  large: {
    height: 64,
    paddingHorizontal: 32,
  },
  // バリアントスタイル
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.transparent,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  tertiaryButton: {
    backgroundColor: COLORS.transparent,
    shadowColor: 'transparent',
    elevation: 0,
  },
  // テキストスタイル
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 15,
  },
  mediumText: {
    fontSize: 17,
  },
  largeText: {
    fontSize: 18,
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.primary,
  },
  tertiaryText: {
    color: COLORS.primary,
  },
  // 無効化状態
  disabledButton: {
    backgroundColor: COLORS.disabled,
    borderColor: COLORS.disabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledText: {
    color: COLORS.disabledText,
  },
});

export default ActionButton;
