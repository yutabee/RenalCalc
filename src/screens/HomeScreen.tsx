import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  Animated,
  Alert,
  TouchableOpacity,
  TextInput,
  Platform,
  View,
} from 'react-native';
import {styles} from '../styles';
import {ActionButton} from '../components/ActionButton';
import {FormulaAccordion} from '../components/FormulaAccordion';
import {ResultCard} from '../components/ResultCard';
import {CKDStage, InputValidation} from '../types/interfaces';

interface HomeScreenProps {
  navigation: any;
}

// CKDステージカラー定義
const CKD_STAGE_COLORS = {
  G1: '#4CAF50',
  G2: '#8BC34A',
  G3a: '#FFC107',
  G3b: '#FF9800',
  G4: '#FF5722',
  G5: '#F44336',
};

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [serumCreatinine, setSerumCreatinine] = useState<string>('');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [ccr, setCcr] = useState<number | null>(null);
  const [egfr, setEgfr] = useState<number | null>(null);
  const [bsa, setBsa] = useState<number | null>(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  // 入力値検証
  const validateInputs = (): InputValidation => {
    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const serumCr = parseFloat(serumCreatinine);

    if (!ageNum || !weightNum || !heightNum || !serumCr) {
      throw new Error('すべての値を入力してください');
    }

    if (ageNum < 18 || ageNum > 120) {
      throw new Error('年齢は18-120の範囲で');
    }

    if (weightNum < 30 || weightNum > 150) {
      throw new Error('体重は30-150kgの範囲で');
    }

    if (heightNum < 120 || heightNum > 200) {
      throw new Error('身長は120-200cmの範囲で');
    }

    if (serumCr < 0.3 || serumCr > 15) {
      throw new Error('血清クレアチニンは0.3-15.0 mg/dLの範囲で');
    }

    return {ageNum, weightNum, heightNum, serumCr};
  };

  // 藤本式によるBSA計算
  const calculateBSA = (heightCm: number, weightKg: number): number => {
    return Math.pow(weightKg, 0.444) * Math.pow(heightCm, 0.663) * 0.008883;
  };

  // CCr計算 (Cockcroft-Gault式・日本人補正なし)
  const calculateCCR = (inputs: InputValidation) => {
    const {ageNum, weightNum, serumCr} = inputs;
    try {
      let ccrValue = ((140 - ageNum) * weightNum) / (72 * serumCr);
      if (sex === 'female') {
        ccrValue *= 0.85;
      }
      setCcr(parseFloat(ccrValue.toFixed(1)));
    } catch (error) {
      console.error('CCR計算エラー:', error);
      throw error;
    }
  };

  // eGFR計算（日本腎臓学会推奨式）
  const calculateEGFR = (inputs: InputValidation) => {
    const {ageNum, serumCr} = inputs;
    try {
      const isMale = sex === 'male';
      // eGFR = 194 × (S-Cr)^-1.094 × (Age)^-0.287 × (女性は×0.739)
      const base = 194 * Math.pow(serumCr, -1.094) * Math.pow(ageNum, -0.287);
      const egfrValue = isMale ? base : base * 0.739;
      setEgfr(parseFloat(egfrValue.toFixed(1)));
    } catch (error) {
      console.error('eGFR計算エラー:', error);
      throw error;
    }
  };

  // CKDステージ判定
  const getCKDStage = (egfrValue: number): CKDStage => {
    if (egfrValue >= 90) {
      return {
        stage: 'G1',
        description: '正常または高値',
        color: CKD_STAGE_COLORS.G1,
      };
    }
    if (egfrValue >= 60) {
      return {stage: 'G2', description: '軽度低下', color: CKD_STAGE_COLORS.G2};
    }
    if (egfrValue >= 45) {
      return {
        stage: 'G3a',
        description: '軽度～中等度低下',
        color: CKD_STAGE_COLORS.G3a,
      };
    }
    if (egfrValue >= 30) {
      return {
        stage: 'G3b',
        description: '中等度～高度低下',
        color: CKD_STAGE_COLORS.G3b,
      };
    }
    if (egfrValue >= 15) {
      return {stage: 'G4', description: '高度低下', color: CKD_STAGE_COLORS.G4};
    }
    return {stage: 'G5', description: '末期腎不全', color: CKD_STAGE_COLORS.G5};
  };

  const handleCalculate = async () => {
    try {
      // フェードアウト→フェードインアニメーション
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const validatedInputs = validateInputs();
      const bsaValue = calculateBSA(
        validatedInputs.heightNum,
        validatedInputs.weightNum,
      );
      setBsa(parseFloat(bsaValue.toFixed(2)));

      setCcr(null);
      setEgfr(null);

      await Promise.all([
        (async () => calculateEGFR(validatedInputs))(),
        (async () => calculateCCR(validatedInputs))(),
      ]);
    } catch (error) {
      console.error('計算エラー:', error);
      if (error instanceof Error) {
        Alert.alert('エラー', error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.subtitle}>日本腎臓学会（JSN）推奨式</Text>
          <View style={styles.inputSection}>
            {/* 性別選択 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>性別</Text>
              <View style={styles.segmentedControl}>
                <TouchableOpacity
                  style={[
                    styles.segmentButton,
                    sex === 'male' && styles.segmentButtonActive,
                  ]}
                  onPress={() => setSex('male')}
                  accessibilityLabel="男性を選択"
                  accessibilityRole="radio"
                  accessibilityState={{checked: sex === 'male'}}>
                  <Text
                    style={[
                      styles.segmentButtonText,
                      sex === 'male' && styles.segmentButtonTextActive,
                    ]}>
                    男性
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.segmentButton,
                    sex === 'female' && styles.segmentButtonActive,
                  ]}
                  onPress={() => setSex('female')}
                  accessibilityLabel="女性を選択"
                  accessibilityRole="radio"
                  accessibilityState={{checked: sex === 'female'}}>
                  <Text
                    style={[
                      styles.segmentButtonText,
                      sex === 'female' && styles.segmentButtonTextActive,
                    ]}>
                    女性
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 年齢 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>年齢</Text>
              <TextInput
                style={styles.input}
                placeholder="18-120"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
                maxLength={3}
                placeholderTextColor="#A0A0A0"
              />
              <Text style={styles.unit}>歳</Text>
            </View>

            {/* 身長 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>身長</Text>
              <TextInput
                style={styles.input}
                placeholder="120-200"
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
                maxLength={3}
                placeholderTextColor="#A0A0A0"
              />
              <Text style={styles.unit}>cm</Text>
            </View>

            {/* 体重 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>体重</Text>
              <TextInput
                style={styles.input}
                placeholder="30-150"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
                maxLength={3}
                placeholderTextColor="#A0A0A0"
              />
              <Text style={styles.unit}>kg</Text>
            </View>

            {/* 血清クレアチニン */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>血清クレアチニン</Text>
              <TextInput
                style={styles.input}
                placeholder="0.3-15.0"
                keyboardType="decimal-pad"
                value={serumCreatinine}
                onChangeText={setSerumCreatinine}
                maxLength={5}
                placeholderTextColor="#A0A0A0"
              />
              <Text style={styles.unit}>mg/dL</Text>
            </View>
          </View>

          <View style={styles.calculationButtons}>
            <ActionButton
              title="計算する"
              onPress={handleCalculate}
              variant="primary"
            />
          </View>

          <Animated.View style={[styles.resultsContainer, {opacity: fadeAnim}]}>
            {(egfr !== null || ccr !== null || bsa !== null) && (
              <>
                <Text style={styles.resultsSectionTitle}>計算結果</Text>
                {egfr !== null && (
                  <ResultCard
                    title="eGFR"
                    value={egfr}
                    unit="mL/min/1.73m²"
                    stage={getCKDStage(egfr)}
                  />
                )}
                {ccr !== null && (
                  <ResultCard title="CCr" value={ccr} unit="mL/min" />
                )}
                {bsa !== null && (
                  <View style={styles.bsaContainer}>
                    <Text style={styles.bsaText}>体表面積: {bsa} m²</Text>
                    <Text style={styles.bsaSubtext}>（藤本式）</Text>
                  </View>
                )}
              </>
            )}
          </Animated.View>

          <FormulaAccordion />

          <View style={styles.footerButtons}>
            <ActionButton
              title="計算式の詳細"
              onPress={() => navigation.navigate('Formulas')}
              variant="secondary"
            />
            <View style={styles.footerButtonsDivider} />
            <View style={styles.footerButtonsRow}>
              <ActionButton
                title="プライバシーポリシー"
                onPress={() => navigation.navigate('PrivacyPolicy')}
                variant="tertiary"
              />
              <ActionButton
                title="免責事項"
                onPress={() => navigation.navigate('Disclaimer')}
                variant="tertiary"
              />
            </View>
          </View>
          <Text style={styles.disclaimer}>
            ※
            この計算結果は参考値です。実際の診断には他の検査結果や臨床所見を含め総合的な判断が必要です。
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HomeScreen;
