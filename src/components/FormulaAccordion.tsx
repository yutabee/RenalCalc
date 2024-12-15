import React, {useState, useRef, useEffect} from 'react';
import {View, Text, TouchableOpacity, Animated} from 'react-native';
import {styles} from '../styles';

export const FormulaAccordion: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const heightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded, heightAnim]);

  return (
    <View style={styles.formulaSection}>
      <TouchableOpacity
        style={styles.formulaHeader}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}>
        <Text style={styles.formulaHeaderText}>計算式について</Text>
        <Animated.Text
          style={[
            styles.formulaHeaderIcon,
            {
              transform: [
                {
                  rotate: heightAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                  }),
                },
              ],
            },
          ]}>
          ▼
        </Animated.Text>
      </TouchableOpacity>

      {isExpanded && (
        <Animated.View style={[styles.formulaContent, {opacity: heightAnim}]}>
          {/* ここに説明文 */}
          <Text style={styles.formulaTitle}>1. eGFR（S-Crを用いる場合）</Text>
          <Text style={styles.formulaDescription}>
            男性：eGFR = 194 × (S-Cr)^{-1.094} × (年齢)^{-0.287}
            {'\n'}
            女性：eGFR = 194 × (S-Cr)^{-1.094} × (年齢)^{-0.287} × 0.739{'\n'}
            （単位：mL/min/1.73m²）
          </Text>

          {/* ... 他の説明 */}
        </Animated.View>
      )}
    </View>
  );
};
