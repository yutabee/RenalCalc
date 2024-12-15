// src/components/FormulaAccordion.tsx

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
          {/* eGFR */}
          <Text style={styles.formulaTitle}>1. eGFR（推算糸球体濾過量）</Text>
          <Text style={styles.formulaDescription}>
            男性：eGFR = 194 × (S-Cr)^(-1.094) × (年齢)^(-0.287){'\n'}
            女性：上式 × 0.739{'\n'}
            （単位：mL/min/1.73m²）
          </Text>

          {/* CCr */}
          <Text style={styles.formulaTitle}>
            2. CCr（クレアチニンクリアランス）
          </Text>
          <Text style={styles.formulaDescription}>
            男性：CCr = ((140 - 年齢) × 体重) / (72 × S-Cr){'\n'}
            女性：上式 × 0.85{'\n'}
            （単位：mL/min）
          </Text>

          {/* BSA */}
          <Text style={styles.formulaTitle}>3. 体表面積（BSA）</Text>
          <Text style={styles.formulaDescription}>
            BSA = 0.008883 × 体重^(0.444) × 身長^(0.663){'\n'}
            （単位：m²）
          </Text>

          {/* CKD重症度分類 */}
          <Text style={styles.formulaTitle}>4. CKD重症度分類</Text>
          <Text style={styles.formulaDescription}>
            G1: ≥90, G2: 60-89, G3a: 45-59, G3b: 30-44, G4: 15-29, G5: ＜15
            （単位：mL/min/1.73m²）
          </Text>

          {/* 注意事項 */}
          <Text style={styles.formulaTitle}>5. 注意事項</Text>
          <Text style={styles.formulaDescription}>
            ・eGFRやCCrは推定値であり、特殊な病態では精度が低下する場合があります。
            {'\n'}
            ・診断や治療には、医師など専門家の意見を必ず仰いでください。
          </Text>
        </Animated.View>
      )}
    </View>
  );
};
