import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  Animated,
  Alert,
  TouchableOpacity,
  Platform,
  View,
  StyleSheet,
  TextStyle,
} from 'react-native';
import {ActionButton} from '../components/ActionButton';
import {FormulaAccordion} from '../components/FormulaAccordion';
import {ResultCard} from '../components/ResultCard';
import {InputField} from '../components/InputField';
import {CKDStage, InputValidation} from '../types/interfaces';

const COLORS = {
  primary: '#1B2B4B',
  primaryLight: '#E8ECF4',
  background: '#F8F9FD',
  surface: '#FFFFFF',
  text: {
    primary: '#1A1A1A',
    secondary: '#6B7280',
    placeholder: '#A0A0A0',
  },
  border: '#E2E8F0',
  ckdStages: {
    G1: '#4CAF50',
    G2: '#8BC34A',
    G3a: '#FFC107',
    G3b: '#FF9800',
    G4: '#FF5722',
    G5: '#F44336',
  },
};

interface HomeScreenProps {
  navigation: any;
}

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

  const validateInputs = (): InputValidation => {
    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const serumCr = parseFloat(serumCreatinine);

    if (!ageNum || !weightNum || !heightNum || !serumCr) {
      throw new Error('すべての値を入力してください');
    }

    if (ageNum < 18 || ageNum > 120) {
      throw new Error('年齢は18-120の範囲で入力してください');
    }

    if (weightNum < 30 || weightNum > 150) {
      throw new Error('体重は30-150kgの範囲で入力してください');
    }

    if (heightNum < 120 || heightNum > 200) {
      throw new Error('身長は120-200cmの範囲で入力してください');
    }

    if (serumCr < 0.3 || serumCr > 15) {
      throw new Error(
        '血清クレアチニンは0.3-15.0 mg/dLの範囲で入力してください',
      );
    }

    return {ageNum, weightNum, heightNum, serumCr};
  };

  const calculateBSA = (heightCm: number, weightKg: number): number => {
    return Math.pow(weightKg, 0.444) * Math.pow(heightCm, 0.663) * 0.008883;
  };

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

  const calculateEGFR = (inputs: InputValidation) => {
    const {ageNum, serumCr} = inputs;
    try {
      const isMale = sex === 'male';
      const base = 194 * Math.pow(serumCr, -1.094) * Math.pow(ageNum, -0.287);
      const egfrValue = isMale ? base : base * 0.739;
      setEgfr(parseFloat(egfrValue.toFixed(1)));
    } catch (error) {
      console.error('eGFR計算エラー:', error);
      throw error;
    }
  };

  const getCKDStage = (egfrValue: number): CKDStage => {
    if (egfrValue >= 90) {
      return {
        stage: 'G1',
        description: '正常または高値',
        color: COLORS.ckdStages.G1,
      };
    }
    if (egfrValue >= 60) {
      return {
        stage: 'G2',
        description: '軽度低下',
        color: COLORS.ckdStages.G2,
      };
    }
    if (egfrValue >= 45) {
      return {
        stage: 'G3a',
        description: '軽度～中等度低下',
        color: COLORS.ckdStages.G3a,
      };
    }
    if (egfrValue >= 30) {
      return {
        stage: 'G3b',
        description: '中等度～高度低下',
        color: COLORS.ckdStages.G3b,
      };
    }
    if (egfrValue >= 15) {
      return {
        stage: 'G4',
        description: '高度低下',
        color: COLORS.ckdStages.G4,
      };
    }
    return {
      stage: 'G5',
      description: '末期腎不全',
      color: COLORS.ckdStages.G5,
    };
  };

  const handleCalculate = async () => {
    try {
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
          <View style={styles.header}>
            <Text style={styles.title}>腎機能評価</Text>
            <Text style={styles.subtitle}>日本腎臓学会（JSN）推奨式</Text>
          </View>

          <View style={styles.card}>
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

            <InputField
              label="年齢"
              value={age}
              onChangeText={setAge}
              placeholder="18-120"
              unit="歳"
              maxLength={3}
            />
            <InputField
              label="身長"
              value={height}
              onChangeText={setHeight}
              placeholder="120-200"
              unit="cm"
              maxLength={3}
            />
            <InputField
              label="体重"
              value={weight}
              onChangeText={setWeight}
              placeholder="30-150"
              unit="kg"
              maxLength={3}
            />
            <InputField
              label="血清クレアチニン"
              value={serumCreatinine}
              onChangeText={setSerumCreatinine}
              placeholder="0.3-15.0"
              unit="mg/dL"
              maxLength={5}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.actionContainer}>
            <ActionButton
              title="計算する"
              onPress={handleCalculate}
              variant="primary"
            />
          </View>

          <Animated.View style={[styles.resultsContainer, {opacity: fadeAnim}]}>
            {(egfr !== null || ccr !== null || bsa !== null) && (
              <>
                <Text style={styles.sectionTitle}>計算結果</Text>
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
                  <View style={styles.bsaCard}>
                    <Text style={styles.bsaValue}>体表面積: {bsa} m²</Text>
                    <Text style={styles.bsaNote}>（藤本式）</Text>
                  </View>
                )}
              </>
            )}
          </Animated.View>

          <FormulaAccordion />

          <View style={styles.footer}>
            <ActionButton
              title="計算式の詳細"
              onPress={() => navigation.navigate('Formulas')}
              variant="secondary"
            />
            <View style={styles.footerDivider} />
            <View style={styles.legalLinks}>
              <TouchableOpacity
                onPress={() => navigation.navigate('PrivacyPolicy')}
                style={styles.legalButton}>
                <Text style={styles.legalButtonText}>プライバシーポリシー</Text>
              </TouchableOpacity>
              <View style={styles.legalDot} />
              <TouchableOpacity
                onPress={() => navigation.navigate('Disclaimer')}
                style={styles.legalButton}>
                <Text style={styles.legalButtonText}>免責事項</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.disclaimer}>
              ※ この計算結果は参考値です。実際の診断には他の検査結果や
              臨床所見を含め総合的な判断が必要です。
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600' as TextStyle['fontWeight'],
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: 4,
    height: 48,
  },
  segmentButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentButtonActive: {
    backgroundColor: COLORS.primary,
  },
  segmentButtonText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    fontWeight: '600' as TextStyle['fontWeight'],
  },
  segmentButtonTextActive: {
    color: COLORS.surface,
  },
  actionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  resultsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  bsaCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  bsaValue: {
    fontSize: 20,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: COLORS.primary,
  },
  bsaNote: {
    fontSize: 13,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  footerDivider: {
    height: 24,
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  legalButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  legalButtonText: {
    fontSize: 13,
    color: COLORS.text.secondary,
    textDecorationLine: 'underline',
  },
  legalDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.text.secondary,
    marginHorizontal: 8,
    opacity: 0.5,
  },
  disclaimer: {
    fontSize: 12,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.8,
  },
});

export default HomeScreen;
