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

interface CKDStage {
  stage: string;
  description: string;
}

interface ResultCardProps {
  title: string;
  value: number;
  unit: string;
  stage?: CKDStage;
  isActive?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({
  title,
  value,
  unit,
  stage,
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
  </View>
);

const App: React.FC = () => {
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [serumCreatinine, setSerumCreatinine] = useState<string>('');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [ccr, setCcr] = useState<number | null>(null);
  const [egfr, setEgfr] = useState<number | null>(null);
  const [bsa, setBsa] = useState<number | null>(null);

  // 体表面積の計算（藤本式）
  const calculateBSA = (heightCm: number, weightKg: number): number => {
    // ここでparseFloatは不要
    return ((heightCm * weightKg) / 3600) ** 0.5;
  };

  const calculateCCR = () => {
    try {
      const ageNum = parseFloat(age);
      const weightNum = parseFloat(weight);
      const serumCr = parseFloat(serumCreatinine);
      const heightNum = parseFloat(height);

      if (!ageNum || !weightNum || !serumCr || !heightNum) {
        throw new Error('すべての値を入力してください');
      }

      if (ageNum < 18 || ageNum > 120) {
        throw new Error('年齢は18歳から120歳の範囲で入力してください');
      }

      if (serumCr <= 0 || serumCr > 20) {
        throw new Error('血清クレアチニン値が範囲外です');
      }

      const bsaValue = calculateBSA(heightNum, weightNum);
      setBsa(parseFloat(bsaValue.toFixed(2)));

      const factor = sex === 'male' ? 1 : 0.85;
      const ccrValue = ((140 - ageNum) * weightNum * factor) / (72 * serumCr);

      const correctedCcr = ccrValue * (1.73 / bsaValue);

      setCcr(parseFloat(correctedCcr.toFixed(1)));
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('エラー', error.message);
      }
    }
  };

  const calculateEGFR = () => {
    try {
      const serumCr = parseFloat(serumCreatinine);
      const ageNum = parseFloat(age);

      if (!ageNum || !serumCr) {
        throw new Error('年齢と血清クレアチニン値を入力してください');
      }

      if (ageNum < 18 || ageNum > 120) {
        throw new Error('年齢は18歳から120歳の範囲で入力してください');
      }

      if (serumCr <= 0 || serumCr > 20) {
        throw new Error('血清クレアチニン値が範囲外です');
      }

      const isMale = sex === 'male';
      const k = isMale ? 0.9 : 0.7;
      const alpha = isMale ? -0.411 : -0.329;
      const sexFactor = isMale ? 1 : 1.018;
      const japaneseCoefficient = 0.813;

      let egfrValue = 141;
      egfrValue *= Math.min(serumCr / k, 1) ** alpha;
      egfrValue *= Math.max(serumCr / k, 1) ** -1.209;
      egfrValue *= 0.993 ** ageNum;
      egfrValue *= sexFactor;
      egfrValue *= japaneseCoefficient;

      setEgfr(parseFloat(egfrValue.toFixed(1)));
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('エラー', error.message);
      }
    }
  };

  const getCKDStage = (egfrValue: number): CKDStage => {
    if (egfrValue >= 90) {
      return {stage: 'G1', description: '正常または高値'};
    }
    if (egfrValue >= 60) {
      return {stage: 'G2', description: '軽度低下'};
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>腎機能評価</Text>
          <Text style={styles.subtitle}>eGFR・CCr 計算ツール</Text>

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
                placeholder="年齢を入力"
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
                placeholder="身長を入力"
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
                placeholder="体重を入力"
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
                placeholder="数値を入力"
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
              onPress={() => {
                calculateEGFR();
                calculateCCR();
              }}>
              <Text style={styles.calculateButtonText}>計算する</Text>
            </TouchableOpacity>
          </View>

          {(egfr !== null || ccr !== null) && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsSectionTitle}>計算結果</Text>
              <View style={styles.resultCards}>
                {egfr !== null && (
                  <ResultCard
                    title="eGFR"
                    value={egfr}
                    unit="mL/min/1.73m²"
                    stage={getCKDStage(egfr)}
                  />
                )}
              </View>
              <View style={styles.resultCards}>
                {ccr !== null && (
                  <ResultCard
                    title="CCr（補正値）"
                    value={ccr}
                    unit="mL/min/1.73m²"
                  />
                )}
              </View>
              {bsa !== null && (
                <Text style={styles.bsaText}>体表面積: {bsa} m²（藤本式）</Text>
              )}
            </View>
          )}

          <Text style={styles.disclaimer}>
            ※
            この計算結果は参考値です。実際の診断には、他の検査結果や臨床所見を含めた総合的な判断が必要です。
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // スタイル定義は同様
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
});

export default App;
