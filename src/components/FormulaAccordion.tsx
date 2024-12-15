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
          <Text style={styles.formulaTitle}>1. eGFR（推算糸球体濾過量）</Text>
          <Text style={styles.formulaDescription}>
            日本腎臓学会 eGFR推算式{'\n\n'}
            男性：eGFR = 194 × Cr^{-1.094} × 年齢^{-0.287}
            {'\n'}
            女性：eGFR = 194 × Cr^{-1.094} × 年齢^{-0.287} × 0.739{'\n\n'}
            ・血清クレアチニン(Cr)：mg/dL{'\n'}
            ・年齢：歳{'\n'}
            ・単位：mL/min/1.73m²{'\n\n'}
            参考：日本腎臓学会 CKD診療ガイド2012／CKD診療ガイドライン2018
          </Text>

          <Text style={styles.formulaTitle}>
            2. CCr（クレアチニンクリアランス）
          </Text>
          <Text style={styles.formulaDescription}>
            Cockcroft-Gault式{'\n\n'}
            男性：CCr = (140 - 年齢) × 体重 / (72 × Cr){'\n'}
            女性：CCr = (140 - 年齢) × 体重 × 0.85 / (72 × Cr){'\n\n'}
            ・年齢：歳{'\n'}
            ・体重：kg{'\n'}
            ・血清クレアチニン(Cr)：mg/dL{'\n'}
            ・単位：mL/min{'\n\n'}
            参考：日本腎臓学会 CKD診療ガイドライン2023
          </Text>

          <Text style={styles.formulaTitle}>3. 体表面積（BSA）</Text>
          <Text style={styles.formulaDescription}>
            藤本式{'\n\n'}
            BSA = 0.008883 × 体重^0.444 × 身長^0.663{'\n\n'}
            ・体重：kg{'\n'}
            ・身長：cm{'\n'}
            ・単位：m²{'\n\n'}
            参考：日本化学療法学会「抗菌薬TDMガイドライン2022」
          </Text>

          <Text style={styles.formulaTitle}>4. CKD重症度分類</Text>
          <Text style={styles.formulaDescription}>
            G1: eGFR ≥ 90 mL/min/1.73m² （正常または高値）{'\n'}
            G2: 60-89 mL/min/1.73m² （軽度低下）{'\n'}
            G3a: 45-59 mL/min/1.73m² （軽度～中等度低下）{'\n'}
            G3b: 30-44 mL/min/1.73m² （中等度～高度低下）{'\n'}
            G4: 15-29 mL/min/1.73m² （高度低下）{'\n'}
            G5: ＜15 mL/min/1.73m² （末期腎不全）{'\n\n'}
            参考：日本腎臓学会「CKD診療ガイド2022」
          </Text>

          <Text style={styles.formulaTitle}>5. 注意事項</Text>
          <Text style={styles.formulaDescription}>
            ・eGFRは日本人のデータに基づく推算式です{'\n'}
            ・CCrは体格の影響を受けるため、体格が標準から外れる場合は注意が必要です
            {'\n'}
            ・特殊な病態（筋肉量の著しい異常、極端な体格、急性腎障害など）では正確な評価が難しい場合があります
            {'\n'}
            ・臨床判断には、これらの指標に加えて、尿検査や画像検査なども含めた総合的な評価が必要です
            {'\n\n'}
            参考：日本腎臓学会「CKD診療ガイドライン2023」
          </Text>
        </Animated.View>
      )}
    </View>
  );
};
