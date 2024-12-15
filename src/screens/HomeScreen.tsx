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
import {ResultCard} from '../components/ResultCard';
import {InputField} from '../components/InputField';
import {CKDStage, InputValidation} from '../types/interfaces';

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
};

const FONTSIZE = {
  xs: 12,
  sm: 13,
  md: 15,
  lg: 16,
  xl: 20,
  xxl: 28,
};

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
    let ccrValue = ((140 - ageNum) * weightNum) / (72 * serumCr);
    if (sex === 'female') {
      ccrValue *= 0.85;
    }
    setCcr(parseFloat(ccrValue.toFixed(1)));
  };

  const calculateEGFR = (inputs: InputValidation) => {
    const {ageNum, serumCr} = inputs;
    const isMale = sex === 'male';
    const base = 194 * Math.pow(serumCr, -1.094) * Math.pow(ageNum, -0.287);
    const egfrValue = isMale ? base : base * 0.739;
    setEgfr(parseFloat(egfrValue.toFixed(1)));
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
      return {stage: 'G2', description: '軽度低下', color: COLORS.ckdStages.G2};
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
      return {stage: 'G4', description: '高度低下', color: COLORS.ckdStages.G4};
    }
    return {stage: 'G5', description: '末期腎不全', color: COLORS.ckdStages.G5};
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
      if (error instanceof Error) {
        Alert.alert('エラー', error.message);
      }
    }
  };

  const showResults = egfr !== null || ccr !== null || bsa !== null;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          {/* ヘッダーセクション */}
          <View style={styles.header}>
            <Text style={styles.title}>腎機能評価</Text>
            <Text style={styles.subtitle}>日本腎臓学会（JSN）推奨式</Text>
          </View>

          {/* 入力フォームカード */}
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

          {/* 計算ボタン */}
          <View style={styles.actionContainer}>
            <ActionButton
              title="計算する"
              onPress={handleCalculate}
              variant="primary"
            />
          </View>

          {/* 結果表示（結果がある時のみ描画） */}
          {showResults && (
            <Animated.View
              style={[styles.resultsContainer, {opacity: fadeAnim}]}>
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
            </Animated.View>
          )}

          {/* フッター */}
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
              ※
              この計算結果は参考値です。実際の診断には他の検査結果や臨床所見を含め総合的な判断が必要です。
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
    paddingBottom: SPACING.lg,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  title: {
    fontSize: FONTSIZE.xxl,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTSIZE.md,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: SPACING.lg,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
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
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONTSIZE.md,
    fontWeight: '600' as TextStyle['fontWeight'],
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: SPACING.xs,
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
    fontSize: FONTSIZE.lg,
    color: COLORS.text.secondary,
    fontWeight: '600' as TextStyle['fontWeight'],
  },
  segmentButtonTextActive: {
    color: COLORS.surface,
  },
  actionContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  resultsContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTSIZE.xl,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
  },
  bsaCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
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
    fontSize: FONTSIZE.xl,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: COLORS.primary,
  },
  bsaNote: {
    fontSize: FONTSIZE.sm,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  footerDivider: {
    height: SPACING.lg,
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  legalButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  legalButtonText: {
    fontSize: FONTSIZE.sm,
    color: COLORS.text.secondary,
    textDecorationLine: 'underline',
  },
  legalDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.text.secondary,
    marginHorizontal: SPACING.sm,
    opacity: 0.5,
  },
  disclaimer: {
    fontSize: FONTSIZE.xs,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.8,
  },
});

export default HomeScreen;
