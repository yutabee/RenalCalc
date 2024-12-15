import React, {useEffect, useRef, useCallback} from 'react';
import {View, Text, Animated, StyleSheet} from 'react-native';

interface Stage {
  stage: string;
  description: string;
  color: string;
}

interface ResultCardProps {
  title: string;
  value: number;
  unit: string;
  stage?: Stage;
  description?: string;
  isActive?: boolean;
  trend?: 'up' | 'down' | 'stable';
}

const COLORS = {
  primary: '#1B2B4B',
  white: '#FFFFFF',
  text: {
    primary: '#1A1A1A',
    secondary: '#6B7280',
    light: '#94A3B8',
  },
  border: '#E2E8F0',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
};

export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  value,
  unit,
  stage,
  description,
  isActive = false,
  trend,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const startPulseAnimation = useCallback(() => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.02,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [pulseAnim]);

  useEffect(() => {
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

    if (isActive) {
      startPulseAnimation();
    }
  }, [fadeAnim, scaleAnim, isActive, startPulseAnimation]);

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return COLORS.success;
      case 'down':
        return COLORS.danger;
      default:
        return COLORS.text.secondary;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        isActive && styles.activeContainer,
        {
          opacity: fadeAnim,
          transform: [{scale: scaleAnim}, {scale: isActive ? pulseAnim : 1}],
        },
      ]}>
      {isActive && <View style={styles.activeIndicator} />}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            {trend && (
              <View
                style={[
                  styles.trendIndicator,
                  {backgroundColor: getTrendColor()},
                ]}>
                <Text style={styles.trendText}>
                  {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{value.toLocaleString()}</Text>
            <Text style={styles.unit}>{unit}</Text>
          </View>
        </View>

        {stage && (
          <View style={styles.stageContainer}>
            <View style={[styles.stageBadge, {backgroundColor: stage.color}]}>
              <Text style={styles.stageBadgeText}>{stage.stage}</Text>
            </View>
            <Text style={styles.stageDescription}>{stage.description}</Text>
          </View>
        )}

        {description && <Text style={styles.description}>{description}</Text>}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  activeContainer: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginRight: 8,
  },
  trendIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  unit: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  stageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  stageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  stageBadgeText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  stageDescription: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  description: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 12,
    lineHeight: 20,
  },
});

export default ResultCard;
