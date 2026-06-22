import React, {useRef, useState} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Animated,
  Easing,
} from 'react-native';
import {colors, radius, spacing, raisedShadow} from '../theme';
import {useReducedMotion} from '../hooks/useReducedMotion';

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
  // 押下時の塗り（pressed fill）をスケールと同時に駆動するためのフラグ
  const [pressed, setPressed] = useState(false);
  const reduceMotion = useReducedMotion();

  const handlePressIn = () => {
    setPressed(true);
    if (reduceMotion) {
      return;
    }
    Animated.timing(scaleAnimation, {
      toValue: 0.96,
      duration: 150,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setPressed(false);
    if (reduceMotion) {
      return;
    }
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
    pressed &&
      !disabled &&
      variant === 'primary' &&
      styles.primaryButtonPressed,
    pressed &&
      !disabled &&
      variant === 'secondary' &&
      styles.secondaryButtonPressed,
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
            color={
              variant === 'primary' ? colors.text.onPrimary : colors.primary
            }
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
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  // サイズバリエーション
  small: {
    minHeight: 44, // keep the public component's tap target >= 44pt
    paddingHorizontal: spacing.lg,
  },
  medium: {
    height: 52,
    paddingHorizontal: spacing.xxl,
  },
  large: {
    height: 64,
    paddingHorizontal: spacing.xxxl,
  },
  // バリアントスタイル
  primaryButton: {
    backgroundColor: colors.primary,
    ...raisedShadow,
  },
  primaryButtonPressed: {
    backgroundColor: colors.primaryPressed,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonPressed: {
    backgroundColor: colors.inputBg,
  },
  tertiaryButton: {
    backgroundColor: 'transparent',
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
    color: colors.text.onPrimary,
  },
  secondaryText: {
    color: colors.primary,
  },
  tertiaryText: {
    color: colors.primary,
  },
  // 無効化状態
  disabledButton: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    // 沈んだ無効状態：影は出さない（primary の raisedShadow を打ち消す）
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledText: {
    color: colors.text.tertiary,
  },
});

export default ActionButton;
