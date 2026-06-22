import React, {useEffect, useRef} from 'react';
import {View, Text, Animated, StyleSheet} from 'react-native';
import {
  colors,
  radius,
  spacing,
  typography,
  raisedShadow,
  readableTextColor,
} from '../theme';
import {useReducedMotion} from '../hooks/useReducedMotion';

interface Stage {
  stage: string;
  description: string;
  color: string;
}

interface ResultCardProps {
  /** Short kicker above the title (e.g. the metric's full name). */
  eyebrow?: string;
  title: string;
  value: number;
  unit: string;
  stage?: Stage;
  description?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  eyebrow,
  title,
  value,
  unit,
  stage,
  description,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      // Skip the entrance motion — show the answer immediately.
      fadeAnim.setValue(1);
      scaleAnim.setValue(1);
      return;
    }
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, reduceMotion]);

  return (
    <Animated.View
      style={[
        styles.container,
        {opacity: fadeAnim, transform: [{scale: scaleAnim}]},
      ]}>
      {eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
      <Text style={styles.title}>{title}</Text>

      <View style={styles.valueContainer}>
        <Text
          style={styles.value}
          maxFontSizeMultiplier={1.3}
          numberOfLines={1}
          adjustsFontSizeToFit>
          {value.toLocaleString()}
        </Text>
        <Text style={styles.unit} maxFontSizeMultiplier={1.4}>
          {unit}
        </Text>
      </View>

      {stage && (
        <View style={styles.stageContainer}>
          <View style={[styles.stageBadge, {backgroundColor: stage.color}]}>
            <Text
              style={[
                styles.stageBadgeText,
                {color: readableTextColor(stage.color)},
              ]}>
              {stage.stage}
            </Text>
          </View>
          <Text style={styles.stageDescription}>{stage.description}</Text>
        </View>
      )}

      {description && <Text style={styles.description}>{description}</Text>}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.card,
    ...raisedShadow,
  },
  eyebrow: {
    ...typography.eyebrow,
    color: colors.text.tertiary,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },
  value: {
    ...typography.resultValue,
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
  unit: {
    ...typography.resultUnit,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  stageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  stageBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.sm,
    marginRight: spacing.sm,
  },
  stageBadgeText: {
    ...typography.label,
  },
  stageDescription: {
    flex: 1,
    ...typography.body,
    color: colors.text.secondary,
  },
  description: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
});

export default ResultCard;
