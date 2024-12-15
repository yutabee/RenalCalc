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

// 型定義
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

// カスタムボタンコンポーネント
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

// ResultCardコンポーネント
const ResultCard: React.FC<ResultCardProps> = ({
  title,
  value,
  unit,
  stage,
  description,
  isActive = false,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // fadeAnimを依存配列に追加
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

// 計算式の説明コンポーネント
const FormulaAccordion: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const heightAnim = useRef(new Animated.Value(0)).current;

  // isExpanded, heightAnim を依存配列に追加
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
        <Animated.View
          style={[
            styles.formulaContent,
            {
              opacity: heightAnim,
            },
          ]}>
          <Text style={styles.formulaTitle}>1. eGFR（推算糸球体濾過量）</Text>
          <Text style={styles.formulaDescription}>
            日本腎臓学会2018年版推算式{'\n'}
            eGFR = 141 × min(Scr/k, 1)α × max(Scr/k,1)-1.209 × 0.993年齢 ×
            性別補正 × 0.813
            {'\n\n'}
            k値: 男性 0.9, 女性 0.7{'\n'}
            α値: 男性 -0.411, 女性 -0.329
          </Text>

          <Text style={styles.formulaTitle}>2. CCr（Cockcroft-Gault式）</Text>
          <Text style={styles.formulaDescription}>
            CCr = ((140 - 年齢) × 体重 × 性別係数) / (72 × Scr) × 0.84{'\n\n'}
            性別係数: 男性 1.0, 女性 0.85{'\n'}
            日本人補正係数: 0.84
          </Text>

          <Text style={styles.formulaTitle}>3. 体表面積（藤本式）</Text>
          <Text style={styles.formulaDescription}>
            BSA = 0.008883 × 体重0.444 × 身長0.663{'\n'}
            単位: m²
          </Text>

          <Text style={styles.formulaTitle}>4. CKD重症度分類</Text>
          <Text style={styles.formulaDescription}>
            G1: eGFR ≥ 90 mL/min/1.73m²{'\n'}
            G2: 60-89 mL/min/1.73m²{'\n'}
            G3a: 45-59 mL/min/1.73m²{'\n'}
            G3b: 30-44 mL/min/1.73m²{'\n'}
            G4: 15-29 mL/min/1.73m²{'\n'}
            G5: ＜15 mL/min/1.73m²
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

// CKDステージの色定義
const CKD_STAGE_COLORS = {
  G1: '#4CAF50', // 緑
  G2: '#8BC34A', // 明るい緑
  G3a: '#FFC107', // 黄色
  G3b: '#FF9800', // オレンジ
  G4: '#FF5722', // 深いオレンジ
  G5: '#F44336', // 赤
};

// ダミー画面 (Formulas)
const Formulas: React.FC = () => (
  <View style={styles.privacyContainer}>
    <Text style={styles.privacyTitle}>計算式一覧</Text>
    <Text style={styles.privacyParagraph}>
      ここに計算式一覧の詳細を記載します。
    </Text>
  </View>
);

// ダミー画面 (Disclaimer)
const Disclaimer: React.FC = () => (
  <View style={styles.privacyContainer}>
    <Text style={styles.privacyTitle}>免責事項</Text>
    <Text style={styles.privacyParagraph}>
      ここに免責事項の詳細を記載します。
    </Text>
  </View>
);

// メインの入力フォームと計算機能を含むホーム画面
const HomeScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [serumCreatinine, setSerumCreatinine] = useState<string>('');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [ccr, setCcr] = useState<number | null>(null);
  const [egfr, setEgfr] = useState<number | null>(null);
  const [bsa, setBsa] = useState<number | null>(null);

  // アニメーション用の値
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // 入力値の検証
  const validateInputs = (): InputValidation => {
    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const serumCr = parseFloat(serumCreatinine);

    if (!ageNum || !weightNum || !heightNum || !serumCr) {
      throw new Error('すべての値を入力してください');
    }

    if (ageNum < 18 || ageNum > 120) {
      throw new Error('年齢は18歳から120歳の範囲で入力してください');
    }

    if (weightNum < 30 || weightNum > 150) {
      throw new Error('体重は30kgから150kgの範囲で入力してください');
    }

    if (heightNum < 120 || heightNum > 200) {
      throw new Error('身長は120cmから200cmの範囲で入力してください');
    }

    if (serumCr < 0.3 || serumCr > 15) {
      throw new Error('血清クレアチニン値が範囲外です（0.3-15.0 mg/dL）');
    }

    return {ageNum, weightNum, heightNum, serumCr};
  };

  // 体表面積計算（藤本式）
  const calculateBSA = (heightCm: number, weightKg: number): number => {
    return weightKg ** 0.444 * heightCm ** 0.663 * 0.008883;
  };

  // CCr計算
  const calculateCCR = (inputs: InputValidation) => {
    const {ageNum, weightNum, heightNum, serumCr} = inputs;
    try {
      const bsaValue = calculateBSA(heightNum, weightNum);
      const factor = sex === 'male' ? 1 : 0.85;
      const japaneseCorrection = 0.84;

      let ccrValue = ((140 - ageNum) * weightNum * factor) / (72 * serumCr);
      ccrValue *= japaneseCorrection;

      const correctedCcr = ccrValue * (1.73 / bsaValue);

      setBsa(parseFloat(bsaValue.toFixed(2)));
      setCcr(parseFloat(correctedCcr.toFixed(1)));
    } catch (error) {
      console.error('CCR計算エラー:', error);
      throw error;
    }
  };

  // eGFR計算
  const calculateEGFR = (inputs: InputValidation) => {
    const {ageNum, serumCr} = inputs;

    try {
      const isMale = sex === 'male';
      const k = isMale ? 0.9 : 0.7;
      const alpha = isMale ? -0.411 : -0.329;
      const japaneseCoefficient = 0.813;

      let egfrValue = 141;
      egfrValue *= Math.min(serumCr / k, 1) ** alpha;
      egfrValue *= Math.max(serumCr / k, 1) ** -1.209;
      egfrValue *= 0.993 ** ageNum;
      egfrValue *= isMale ? 1 : 1.018;
      egfrValue *= japaneseCoefficient;

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
        description: '正常または高値（腎症の存在確認が必要）',
        color: CKD_STAGE_COLORS.G1,
      };
    }
    if (egfrValue >= 60) {
      return {
        stage: 'G2',
        description: '軽度低下（腎症の存在確認が必要）',
        color: CKD_STAGE_COLORS.G2,
      };
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
      return {
        stage: 'G4',
        description: '高度低下',
        color: CKD_STAGE_COLORS.G4,
      };
    }
    return {
      stage: 'G5',
      description: '末期腎不全',
      color: CKD_STAGE_COLORS.G5,
    };
  };

  // 計算実行
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

      setBsa(null);
      setCcr(null);
      setEgfr(null);

      await Promise.all([
        calculateEGFR(validatedInputs),
        calculateCCR(validatedInputs),
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
          <Text style={styles.subtitle}>日本腎臓学会2018年版準拠</Text>

          <View style={styles.inputSection}>
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
                accessibilityLabel="年齢入力"
                accessibilityHint="18歳から120歳までの値を入力"
                returnKeyType="next"
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
                accessibilityLabel="身長入力"
                accessibilityHint="センチメートル単位で入力"
                returnKeyType="next"
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
                accessibilityLabel="体重入力"
                accessibilityHint="キログラム単位で入力"
                returnKeyType="next"
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
                accessibilityLabel="血清クレアチニン入力"
                accessibilityHint="mg/dL単位で入力"
                returnKeyType="done"
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
                  <ResultCard
                    title="CCr（補正値）"
                    value={ccr}
                    unit="mL/min/1.73m²"
                  />
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
            <ActionButton
              title="免責事項"
              onPress={() => navigation.navigate('Disclaimer')}
              variant="tertiary"
            />
          </View>

          <Text style={styles.disclaimer}>
            ※
            この計算結果は参考値です。実際の診断には、他の検査結果や臨床所見を含めた総合的な判断が必要です。
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootApp;

const styles = StyleSheet.create({
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
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
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
  actionButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2D6A4F',
    marginVertical: 8,
  },
  actionButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2D6A4F',
  },
  actionButtonTertiary: {
    backgroundColor: 'transparent',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  actionButtonTextSecondary: {
    color: '#2D6A4F',
  },
  actionButtonTextTertiary: {
    color: '#666666',
  },
  calculationButtons: {
    marginTop: 24,
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
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
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
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
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
  footerButtons: {
    marginBottom: 24,
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
