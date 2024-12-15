import React, {useState} from 'react';
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
} from 'react-native';

// 型定義
interface CKDStage {
  stage: string;
  description: string;
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

// ResultCardコンポーネント
const ResultCard: React.FC<ResultCardProps> = ({
  title,
  value,
  unit,
  stage,
  description,
  isActive = false,
}) => (
  <View style={[styles.resultCard, isActive && styles.activeResultCard]}>
    <Text style={styles.resultTitle}>{title}</Text>
    <Text style={styles.resultValue}>{value}</Text>
    <Text style={styles.resultUnit}>{unit}</Text>
    {stage && (
      <View style={styles.stageContainer}>
        <Text style={styles.stageText}>
          {stage.stage}: {stage.description}
        </Text>
      </View>
    )}
    {description && <Text style={styles.resultDescription}>{description}</Text>}
  </View>
);

// 計算式の説明コンポーネント
const FormulaAccordion: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.formulaSection}>
      <TouchableOpacity
        style={styles.formulaHeader}
        onPress={() => setIsExpanded(!isExpanded)}>
        <Text style={styles.formulaHeaderText}>計算式について</Text>
        <Text style={styles.formulaHeaderIcon}>{isExpanded ? '▼' : '▶'}</Text>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.formulaContent}>
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
            G1: eGFR ≥ 90{'\n'}
            G2: 60 ≤ eGFR ＜ 90{'\n'}
            G3a: 45 ≤ eGFR ＜ 60{'\n'}
            G3b: 30 ≤ eGFR ＜ 45{'\n'}
            G4: 15 ≤ eGFR ＜ 30{'\n'}
            G5: eGFR ＜ 15
          </Text>
        </View>
      )}
    </View>
  );
};

const App: React.FC = () => {
  // State管理
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [serumCreatinine, setSerumCreatinine] = useState<string>('');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [ccr, setCcr] = useState<number | null>(null);
  const [egfr, setEgfr] = useState<number | null>(null);
  const [bsa, setBsa] = useState<number | null>(null);

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

  const calculateBSA = (heightCm: number, weightKg: number): number => {
    return weightKg ** 0.444 * heightCm ** 0.663 * 0.008883;
  };

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

  const getCKDStage = (egfrValue: number): CKDStage => {
    if (egfrValue >= 90) {
      return {
        stage: 'G1',
        description: '正常または高値（腎症の存在確認が必要）',
      };
    }
    if (egfrValue >= 60) {
      return {stage: 'G2', description: '軽度低下（腎症の存在確認が必要）'};
    }
    if (egfrValue >= 45) {
      return {stage: 'G3a', description: '軽度～中等度低下'};
    }
    if (egfrValue >= 30) {
      return {stage: 'G3b', description: '中等度～高度低下'};
    }
    if (egfrValue >= 15) {
      return {stage: 'G4', description: '高度低下'};
    }
    return {stage: 'G5', description: '末期腎不全'};
  };

  const handleCalculate = async () => {
    try {
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
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>腎機能評価</Text>
          <Text style={styles.subtitle}>
            eGFR・CCr 計算ツール（日本腎臓学会2018年版準拠）
          </Text>

          <View style={styles.inputSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>性別</Text>
              <View style={styles.segmentedControl}>
                <TouchableOpacity
                  style={[
                    styles.segmentButton,
                    sex === 'male' && styles.segmentButtonActive,
                  ]}
                  onPress={() => setSex('male')}>
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
                  onPress={() => setSex('female')}>
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
                placeholder="年齢を入力（18-120）"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
                placeholderTextColor="#A0A0A0"
              />
              <Text style={styles.unit}>歳</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>身長</Text>
              <TextInput
                style={styles.input}
                placeholder="身長を入力（120-200）"
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
                placeholderTextColor="#A0A0A0"
              />
              <Text style={styles.unit}>cm</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>体重</Text>
              <TextInput
                style={styles.input}
                placeholder="体重を入力（30-150）"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
                placeholderTextColor="#A0A0A0"
              />
              <Text style={styles.unit}>kg</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>血清クレアチニン</Text>
              <TextInput
                style={styles.input}
                placeholder="数値を入力（0.3-15.0）"
                keyboardType="numeric"
                value={serumCreatinine}
                onChangeText={setSerumCreatinine}
                placeholderTextColor="#A0A0A0"
              />
              <Text style={styles.unit}>mg/dL</Text>
            </View>
          </View>

          <View style={styles.calculationButtons}>
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={handleCalculate}>
              <Text style={styles.calculateButtonText}>計算する</Text>
            </TouchableOpacity>
          </View>

          {(egfr !== null || ccr !== null || bsa !== null) && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsSectionTitle}>計算結果</Text>
              {egfr !== null && (
                <View style={styles.resultCards}>
                  <ResultCard
                    title="eGFR"
                    value={egfr}
                    unit="mL/min/1.73m²"
                    stage={getCKDStage(egfr)}
                  />
                </View>
              )}
              {ccr !== null && (
                <View style={styles.resultCards}>
                  <ResultCard
                    title="CCr（補正値）"
                    value={ccr}
                    unit="mL/min/1.73m²"
                  />
                </View>
              )}
              {bsa !== null && (
                <Text style={styles.bsaText}>体表面積: {bsa} m²（藤本式）</Text>
              )}
            </View>
          )}

          <FormulaAccordion />

          <Text style={styles.disclaimer}>
            ※
            この計算結果は参考値です。実際の診断には、他の検査結果や臨床所見を含めた総合的な判断が必要です。
            {'\n'}
            日本腎臓学会2018年版のeGFR推算式に準拠しています。
            {'\n'}
            体表面積は藤本式（1960年）を使用しています。
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  inputSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
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
    backgroundColor: '#F7F8FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1A1A1A',
  },
  unit: {
    position: 'absolute',
    right: 16,
    top: 45,
    color: '#666666',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F7F8FA',
    borderRadius: 12,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentButtonActive: {
    backgroundColor: '#2D6A4F',
  },
  segmentButtonText: {
    fontSize: 16,
    color: '#666666',
  },
  segmentButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  calculationButtons: {
    marginTop: 24,
  },
  calculateButton: {
    backgroundColor: '#2D6A4F',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    marginTop: 32,
  },
  resultsSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  resultCards: {
    marginBottom: 12,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D6A4F',
    marginBottom: 4,
  },
  resultUnit: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  stageContainer: {
    backgroundColor: '#F0F7F4',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  stageText: {
    fontSize: 14,
    color: '#2D6A4F',
    fontWeight: '600',
  },
  resultDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    textAlign: 'left',
  },
  bsaText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
  },
  disclaimer: {
    fontSize: 12,
    color: '#666666',
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  activeResultCard: {
    backgroundColor: '#F0F7F4',
    borderColor: '#2D6A4F',
    borderWidth: 2,
  },
  // 計算式表示用のスタイル
  formulaSection: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
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
    fontSize: 16,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 12,
    marginBottom: 8,
  },
  formulaDescription: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
    marginBottom: 16,
  },
});

export default App;
