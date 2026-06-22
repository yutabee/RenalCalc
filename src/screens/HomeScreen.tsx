import React, {useState, useRef, useCallback} from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  Animated,
  Easing,
  Keyboard,
  TouchableOpacity,
  Platform,
  View,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import {ActionButton} from '../components/ActionButton';
import {ResultCard} from '../components/ResultCard';
import {InputField} from '../components/InputField';
import type {CKDStage} from '../types/interfaces';
import {
  colors,
  spacing,
  radius,
  typography,
  hairline,
  cardShadow,
  stageColors,
} from '../theme';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {
  calculateBSA,
  calculateCCr,
  calculateEGFR,
  getCKDStage,
  validateInputs,
  collectInputErrors,
} from '../utils/calculations';
import type {InputErrors, Sex} from '../utils/calculations';

const buildStageDisplay = (egfrValue: number): CKDStage => {
  const stageInfo = getCKDStage(egfrValue);
  return {...stageInfo, color: stageColors[stageInfo.stage]};
};

const SEX_OPTIONS: ReadonlyArray<{value: Sex; label: string; a11y: string}> = [
  {value: 'male', label: '男性', a11y: '男性を選択'},
  {value: 'female', label: '女性', a11y: '女性を選択'},
];

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
  const [fieldErrors, setFieldErrors] = useState<InputErrors>({});

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scrollRef = useRef<ScrollView>(null);
  const reduceMotion = useReducedMotion();

  // Width of a single segment, measured from the track. Guarded against 0 so
  // the indicator never snaps to a bad position on first render or under jest.
  const [segmentWidth, setSegmentWidth] = useState<number>(0);
  const indicatorX = useRef(new Animated.Value(0)).current;

  const selectSex = useCallback(
    (value: Sex) => {
      setSex(value);
      const index = value === 'male' ? 0 : 1;
      const toValue = segmentWidth * index;
      // One animation owns the value at a time — stop any in-flight slide first.
      indicatorX.stopAnimation();
      if (segmentWidth > 0 && !reduceMotion) {
        Animated.timing(indicatorX, {
          toValue,
          duration: 180,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
      } else {
        // No measured width yet, or reduce-motion: snap without animating.
        indicatorX.setValue(toValue);
      }
    },
    [segmentWidth, indicatorX, reduceMotion],
  );

  const handleTrackLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const width = e.nativeEvent.layout.width / SEX_OPTIONS.length;
      if (width > 0) {
        setSegmentWidth(width);
        // Snap the indicator under the currently selected segment.
        const index = sex === 'male' ? 0 : 1;
        indicatorX.setValue(width * index);
      }
    },
    [sex, indicatorX],
  );

  // Update a field and clear its inline error as soon as the user edits it.
  const makeChangeHandler =
    (setter: (v: string) => void, field: keyof InputErrors) =>
    (text: string) => {
      setter(text);
      setFieldErrors(prev =>
        prev[field] ? {...prev, [field]: undefined} : prev,
      );
    };

  const handleCalculate = () => {
    Keyboard.dismiss();

    const errors = collectInputErrors({
      age,
      weight,
      height,
      serumCreatinine,
      sex,
    });
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setEgfr(null);
      setCcr(null);
      setBsa(null);
      return;
    }

    if (!reduceMotion) {
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
    }

    const inputs = validateInputs({age, weight, height, serumCreatinine, sex});
    const bsaValue = calculateBSA(inputs.height, inputs.weight);
    const egfrValue = calculateEGFR(
      inputs.serumCreatinine,
      inputs.age,
      inputs.sex,
    );
    const ccrValue = calculateCCr(
      inputs.age,
      inputs.weight,
      inputs.serumCreatinine,
      inputs.sex,
    );

    setBsa(parseFloat(bsaValue.toFixed(2)));
    setEgfr(parseFloat(egfrValue.toFixed(1)));
    setCcr(parseFloat(ccrValue.toFixed(1)));

    // Bring the freshly rendered results into view.
    requestAnimationFrame(() =>
      scrollRef.current?.scrollToEnd?.({animated: true}),
    );
  };

  const showResults = egfr !== null || ccr !== null || bsa !== null;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}>
          {/* ヘッダーセクション */}
          <View style={styles.header}>
            <Text style={styles.eyebrow}>臨床計算</Text>
            <Text style={styles.title}>腎機能評価</Text>
            <Text style={styles.subtitle}>日本腎臓学会（JSN）推奨式</Text>
          </View>
          <View style={styles.headerRule} />

          {/* 入力フォームカード */}
          <View style={styles.card}>
            <Text style={styles.cardEyebrow}>入力</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>性別</Text>
              <View
                style={styles.segmentedControl}
                onLayout={handleTrackLayout}
                accessibilityRole="radiogroup"
                accessibilityLabel="性別">
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.segmentIndicator,
                    {
                      width: segmentWidth,
                      transform: [{translateX: indicatorX}],
                    },
                  ]}
                />
                {SEX_OPTIONS.map(option => {
                  const active = sex === option.value;
                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={styles.segmentButton}
                      onPress={() => selectSex(option.value)}
                      accessibilityLabel={option.a11y}
                      accessibilityRole="radio"
                      accessibilityState={{checked: active}}>
                      <Text
                        style={[
                          styles.segmentButtonText,
                          active && styles.segmentButtonTextActive,
                        ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <InputField
              label="年齢"
              value={age}
              onChangeText={makeChangeHandler(setAge, 'age')}
              placeholder="18-120"
              unit="歳"
              maxLength={3}
              error={fieldErrors.age}
            />
            <InputField
              label="身長"
              value={height}
              onChangeText={makeChangeHandler(setHeight, 'height')}
              placeholder="120-200"
              unit="cm"
              maxLength={3}
              error={fieldErrors.height}
            />
            <InputField
              label="体重"
              value={weight}
              onChangeText={makeChangeHandler(setWeight, 'weight')}
              placeholder="30-150"
              unit="kg"
              maxLength={3}
              error={fieldErrors.weight}
            />
            <InputField
              label="血清クレアチニン"
              value={serumCreatinine}
              onChangeText={makeChangeHandler(
                setSerumCreatinine,
                'serumCreatinine',
              )}
              placeholder="0.3-15.0"
              unit="mg/dL"
              maxLength={5}
              keyboardType="decimal-pad"
              error={fieldErrors.serumCreatinine}
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
                  eyebrow="推算糸球体濾過量"
                  title="eGFR"
                  value={egfr}
                  unit="mL/min/1.73m²"
                  stage={buildStageDisplay(egfr)}
                />
              )}
              {ccr !== null && (
                <ResultCard
                  eyebrow="クレアチニンクリアランス"
                  title="CCr"
                  value={ccr}
                  unit="mL/min"
                />
              )}
              {bsa !== null && (
                <ResultCard
                  eyebrow="体表面積"
                  title="BSA"
                  value={bsa}
                  unit="m²"
                  description="藤本式"
                />
              )}
            </Animated.View>
          )}

          {/* フッター */}
          <View style={styles.footerRule} />
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
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  eyebrow: {
    ...typography.eyebrow,
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
  },
  headerRule: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.gutter,
    marginBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.card,
    marginHorizontal: spacing.gutter,
    marginBottom: spacing.xxl,
    ...hairline,
    ...cardShadow,
  },
  cardEyebrow: {
    ...typography.eyebrow,
    color: colors.text.tertiary,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.label,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    height: 44,
    ...hairline,
    overflow: 'hidden',
  },
  segmentIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    ...hairline,
  },
  segmentButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentButtonText: {
    ...typography.label,
    color: colors.text.secondary,
  },
  segmentButtonTextActive: {
    color: colors.text.primary,
  },
  actionContainer: {
    paddingHorizontal: spacing.gutter,
    marginBottom: spacing.xxl,
  },
  resultsContainer: {
    paddingHorizontal: spacing.gutter,
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  footerRule: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.gutter,
    marginBottom: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.xl,
  },
  footerDivider: {
    height: spacing.lg,
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  legalButton: {
    minHeight: 44, // Apple HIG / WCAG 2.5.5 minimum tap target
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  legalButtonText: {
    ...typography.legal,
    color: colors.text.tertiary,
    textDecorationLine: 'underline',
  },
  legalDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.text.tertiary,
    marginHorizontal: spacing.sm,
    opacity: 0.5,
  },
  disclaimer: {
    ...typography.legal,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});

export default HomeScreen;
