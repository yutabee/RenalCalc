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
import type {CKDStage} from '../types/interfaces';
import {
  calculateBSA,
  calculateCCr,
  calculateEGFR,
  getCKDStage,
  validateInputs,
} from '../utils/calculations';
import type {CKDStageInfo, Sex} from '../utils/calculations';

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

const STAGE_COLORS: Record<CKDStageInfo['stage'], string> = {
  G1: COLORS.ckdStages.G1,
  G2: COLORS.ckdStages.G2,
  G3a: COLORS.ckdStages.G3a,
  G3b: COLORS.ckdStages.G3b,
  G4: COLORS.ckdStages.G4,
  G5: COLORS.ckdStages.G5,
};

const buildStageDisplay = (egfrValue: number): CKDStage => {
  const stageInfo = getCKDStage(egfrValue);
  return {...stageInfo, color: STAGE_COLORS[stageInfo.stage]};
};

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [serumCreatinine, setSerumCreatinine] = useState<string>('');
  const [sex, setSex] = useState<Sex>('male');
  const [ccr, setCcr] = useState<number | null>(null);
  const [egfr, setEgfr] = useState<number | null>(null);
  const [bsa, setBsa] = useState<number | null>(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;

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

      const validatedInputs = validateInputs({
        age,
        weight,
        height,
        serumCreatinine,
        sex,
      });
      const bsaValue = calculateBSA(
        validatedInputs.height,
        validatedInputs.weight,
      );
      setBsa(parseFloat(bsaValue.toFixed(2)));

      setCcr(null);
      setEgfr(null);

      await Promise.all([
        (async () => {
          const egfrValue = calculateEGFR(
            validatedInputs.serumCreatinine,
            validatedInputs.age,
            validatedInputs.sex,
          );
          setEgfr(parseFloat(egfrValue.toFixed(1)));
        })(),
        (async () => {
          const ccrValue = calculateCCr(
            validatedInputs.age,
            validatedInputs.weight,
            validatedInputs.serumCreatinine,
            validatedInputs.sex,
          );
          setCcr(parseFloat(ccrValue.toFixed(1)));
        })(),
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
                  stage={buildStageDisplay(egfr)}
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
