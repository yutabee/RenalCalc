import React, {useEffect, useRef} from 'react';
import {View, Text, Animated} from 'react-native';
import {ResultCardProps} from '../types/interfaces';
import {styles} from '../styles';

export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  value,
  unit,
  stage,
  description,
  isActive = false,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={[
        styles.resultCard,
        isActive && styles.activeResultCard,
        {opacity: fadeAnim},
      ]}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>{title}</Text>
        <Text style={styles.resultValue}>
          {value}
          <Text style={styles.resultUnit}> {unit}</Text>
        </Text>
      </View>
      {stage && (
        <View style={styles.stageContainer}>
          <View style={[styles.stageBadge, {backgroundColor: stage.color}]}>
            <Text style={styles.stageBadgeText}>{stage.stage}</Text>
          </View>
          <Text style={styles.stageDescription}>{stage.description}</Text>
        </View>
      )}
      {description && (
        <Text style={styles.resultDescription}>{description}</Text>
      )}
    </Animated.View>
  );
};
