import 'react-native-gesture-handler';
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

interface CKDStage {
  stage: string;
  description: string;
  color: string;
}

interface ResultCardProps {
  title: string;
  value: number;
  unit: string;
  stage?: CKDStage;
  description?: string;
  isActive?: boolean;
}

interface InputValidation {
  ageNum: number;
  weightNum: number;
  heightNum: number;
  serumCr: number;
}

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  backgroundColor?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  backgroundColor,
}) => (
  <TouchableOpacity
    style={[
      styles.actionButton,
      variant === 'secondary' && styles.actionButtonSecondary,
      variant === 'tertiary' && styles.actionButtonTertiary,
      backgroundColor && {backgroundColor},
    ]}
    onPress={onPress}
    activeOpacity={0.7}>
    <Text
      style={[
        styles.actionButtonText,
        variant === 'secondary' && styles.actionButtonTextSecondary,
        variant === 'tertiary' && styles.actionButtonTextTertiary,
      ]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const CKD_STAGE_COLORS = {
  G1: '#4CAF50',
  G2: '#8BC34A',
  G3a: '#FFC107',
  G3b: '#FF9800',
  G4: '#FF5722',
  G5: '#F44336',
};

const ResultCard: React.FC<ResultCardProps> = ({
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

// 計算式の説明コンポーネント（最新推奨式に更新）
const FormulaAccordion: React.FC = () => {
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
          <Text style={styles.formulaTitle}>1. eGFR（S-Crを用いる場合）</Text>
          <Text style={styles.formulaDescription}>
            男性：eGFR = 194 × (S-Cr)^{-1.094} × (年齢)^{-0.287}
            {'\n'}
            女性：eGFR = 194 × (S-Cr)^{-1.094} × (年齢)^{-0.287} × 0.739{'\n'}
            （単位：mL/min/1.73m²）
          </Text>

          <Text style={styles.formulaTitle}>2. CCr（Cockcroft-Gault式）</Text>
          <Text style={styles.formulaDescription}>
            男性：CCr = ((140 - 年齢) × 体重) / (72 × S-Cr){'\n'}
            女性：上式 × 0.85{'\n'}
            （単位：mL/min）
          </Text>

          <Text style={styles.formulaTitle}>3. シスタチンCを用いたeGFR</Text>
          <Text style={styles.formulaDescription}>
            本コードでは割愛していますが、必要に応じて
            JSN/JSNPの推奨式を適用してください。
          </Text>

          <Text style={styles.formulaTitle}>CKD重症度分類</Text>
          <Text style={styles.formulaDescription}>
            G1: ≥90, G2: 60-89, G3a: 45-59, G3b: 30-44, G4: 15-29, G5: &lt; 15
            (mL/min/1.73m²)
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const PrivacyPolicy: React.FC = () => (
  <View style={styles.privacyContainer}>
    <Text style={styles.privacyTitle}>プライバシーポリシー</Text>
    <Text style={styles.privacyParagraph}>
      ここにプライバシーポリシーの文言を記載します。
    </Text>
  </View>
);

const Formulas: React.FC = () => (
  <View style={styles.privacyContainer}>
    <Text style={styles.privacyTitle}>計算式一覧</Text>
    <Text style={styles.privacyParagraph}>
      ここに計算式一覧の詳細を記載します。（eGFR・CCrなど）
    </Text>
  </View>
);

const Disclaimer: React.FC = () => (
  <View style={styles.privacyContainer}>
    <Text style={styles.privacyTitle}>免責事項</Text>
    <Text style={styles.privacyParagraph}>
      ここに免責事項の詳細を記載します。
    </Text>
  </View>
);

const HomeScreen: React.FC<{navigation: any}> = ({navigation}) => {
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

  const calculateBSA = (heightCm: number, weightKg: number): number => {
    return Math.pow(weightKg, 0.444) * Math.pow(heightCm, 0.663) * 0.008883;
  };

  // CCr計算（C-G式　日本人補正削除）
  const calculateCCR = (inputs: InputValidation) => {
    const {ageNum, weightNum, serumCr} = inputs;
    try {
      let ccrValue = ((140 - ageNum) * weightNum) / (72 * serumCr);
      if (sex === 'female') {
        ccrValue *= 0.85;
      }
      // CCr (mL/min)、ここではBSA補正なし、公式そのまま使用
      setCcr(parseFloat(ccrValue.toFixed(1)));
    } catch (error) {
      console.error('CCR計算エラー:', error);
      throw error;
    }
  };

  // eGFR計算（S-Cr使用、日本腎臓学会推奨式）
  const calculateEGFR = (inputs: InputValidation) => {
    const {ageNum, serumCr} = inputs;
    try {
      const isMale = sex === 'male';
      // eGFR = 194 * (S-Cr)^-1.094 * (Age)^-0.287 * (女性は×0.739)
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

      // BSA算出（藤本式）
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
            {/* 入力フォーム省略（同様） */}
            {/* ... */}
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

            {/* 年齢、身長、体重、血清Cr入力グループも同様 */}
            {/* ... */}

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

const Stack = createNativeStackNavigator();

const RootApp: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: '腎機能評価ツール'}}
        />
        <Stack.Screen
          name="Formulas"
          component={Formulas}
          options={{title: '計算式一覧'}}
        />
        <Stack.Screen
          name="Disclaimer"
          component={Disclaimer}
          options={{title: '免責事項'}}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{title: 'プライバシーポリシー'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootApp;

const styles = StyleSheet.create({
  // スタイルは従来通り
  // ...
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  subtitle: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  inputSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {fontSize: 15, fontWeight: '600', color: '#1A1A1A', marginBottom: 8},
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 17,
    color: '#1A1A1A',
    height: 48,
  },
  unit: {
    position: 'absolute',
    right: 16,
    top: 45,
    color: '#666666',
    fontSize: 15,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
    height: 40,
  },
  segmentButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentButtonActive: {
    backgroundColor: '#2D6A4F',
  },
  segmentButtonText: {
    fontSize: 15,
    color: '#666666',
    fontWeight: '600',
  },
  segmentButtonTextActive: {
    color: '#FFFFFF',
  },
  calculationButtons: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  footerButtons: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  footerButtonsDivider: {
    height: 8,
  },
  footerButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2D6A4F',
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  actionButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2D6A4F',
  },
  actionButtonTertiary: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.24,
  },
  actionButtonTextSecondary: {
    color: '#2D6A4F',
  },
  actionButtonTextTertiary: {
    color: '#2D6A4F',
  },
  resultsContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  resultsSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  activeResultCard: {
    borderWidth: 2,
    borderColor: '#2D6A4F',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  resultValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D6A4F',
  },
  resultUnit: {
    fontSize: 15,
    color: '#666666',
  },
  stageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  stageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  stageBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  stageDescription: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
  },
  resultDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
  bsaContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  bsaText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2D6A4F',
  },
  bsaSubtext: {
    fontSize: 13,
    color: '#666666',
    marginTop: 4,
  },
  formulaSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 3,
  },
  formulaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F0F7F4',
  },
  formulaHeaderText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2D6A4F',
  },
  formulaHeaderIcon: {
    fontSize: 16,
    color: '#2D6A4F',
  },
  formulaContent: {
    padding: 16,
  },
  formulaTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 12,
    marginBottom: 8,
  },
  formulaDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 16,
  },
  privacyContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  privacyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  privacyParagraph: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333333',
    marginBottom: 16,
  },
});
