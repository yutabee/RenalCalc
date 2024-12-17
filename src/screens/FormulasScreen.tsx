import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
  Linking,
  TouchableOpacity,
} from 'react-native';

const COLORS = {
  primary: '#1B2B4B',
  primaryLight: '#E8ECF4',
  background: '#F8F9FD',
  surface: '#FFFFFF',
  text: {
    primary: '#1A1A1A',
    secondary: '#6B7280',
    accent: '#1B2B4B',
    highlight: '#2A3F6C',
  },
  divider: '#E2E8F0',
  formula: '#F1F5F9',
};

interface Formula {
  title: string;
  subtitle?: string;
  formulas?: string[];
  parameters?: string[];
  description: string[];
}

const formulaList: Formula[] = [
  {
    title: '1. eGFR（推算糸球体濾過量）',
    subtitle: '日本腎臓学会推奨式（S-Cr使用）',
    formulas: [
      '男性：eGFR = 194 × (S-Cr)^(-1.094) × (年齢)^(-0.287)',
      '女性：eGFR = [上記計算式] × 0.739',
    ],
    parameters: [
      'S-Cr（血清クレアチニン）：mg/dL',
      '年齢：歳',
      '単位：mL/min/1.73m²',
    ],
    description: [
      'eGFRは腎機能を概ね把握するための指標で、CKD（慢性腎臓病）の診断や進行度評価に用いられます。',
      '日本人に合わせた調整式であり、国内での臨床適用性が高いとされています。',
    ],
  },
  {
    title: '2. CCr（クレアチニンクリアランス）',
    subtitle: 'Cockcroft-Gault式',
    formulas: [
      '男性：CCr = ((140 - 年齢) × 体重) / (72 × S-Cr)',
      '女性：CCr = ((140 - 年齢) × 体重 × 0.85) / (72 × S-Cr)',
    ],
    parameters: ['年齢：歳', '体重：kg', 'S-Cr：mg/dL', '単位：mL/min'],
    description: [
      'CCrはGFRの近似値として用いられますが、尿細管分泌などの影響でGFRより高めに出る傾向があります。',
      '主に薬剤投与量調整の指標として使用されることが多い計算式です。',
    ],
  },
  {
    title: '3. 体表面積（BSA）',
    subtitle: '藤本式',
    formulas: ['BSA = 0.008883 × (体重^0.444) × (身長^0.663)'],
    parameters: ['体重：kg', '身長：cm', '単位：m²'],
    description: [
      'BSAは薬剤用量計算や腎機能値の補正に用いられる身体指標です。',
      '藤本式は日本人の体格に合わせて導出された計算式として知られています。',
    ],
  },
];

const stages = [
  {stage: 'G1', range: '≥ 90', description: '正常または高値'},
  {stage: 'G2', range: '60-89', description: '軽度低下'},
  {stage: 'G3a', range: '45-59', description: '軽度～中等度低下'},
  {stage: 'G3b', range: '30-44', description: '中等度～高度低下'},
  {stage: 'G4', range: '15-29', description: '高度低下'},
  {stage: 'G5', range: '< 15', description: '末期腎不全'},
];

const FormulaSection: React.FC<Formula> = ({
  title,
  subtitle,
  formulas: formulaEquations,
  parameters,
  description,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

    {formulaEquations && (
      <View style={styles.formulaBox}>
        {formulaEquations.map((equation, index) => (
          <Text key={index} style={styles.formula}>
            {equation}
          </Text>
        ))}
      </View>
    )}

    {parameters && (
      <View style={styles.parameterList}>
        {parameters.map((param, index) => (
          <Text key={index} style={styles.parameter}>
            • {param}
          </Text>
        ))}
      </View>
    )}

    {description.map((text, index) => (
      <Text key={index} style={styles.description}>
        {text}
      </Text>
    ))}
  </View>
);

const LinkText: React.FC<{href: string; text: string}> = ({href, text}) => (
  <TouchableOpacity onPress={() => Linking.openURL(href)}>
    <Text style={styles.linkText}>{text}</Text>
  </TouchableOpacity>
);

const FormulasScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>計算式一覧</Text>
          <Text style={styles.introText}>
            本アプリは腎機能評価に用いる計算式を提供しています。計算結果はあくまで参考値であり、医学的アドバイス、診断、治療を目的とするものではありません。
            必ず医師や医療専門家の判断を仰いでください。
            {'\n\n'}
            医療上の判断や診断、治療方針の決定を行う前に、必ず医師に相談してください。
          </Text>
        </View>

        <View style={styles.content}>
          {formulaList.map((formula, index) => (
            <FormulaSection key={index} {...formula} />
          ))}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CKD重症度分類（Gステージ）</Text>
            <View style={styles.stageGrid}>
              {stages.map((item, index) => (
                <View key={index} style={styles.stageRow}>
                  <Text style={styles.stageCell}>{item.stage}</Text>
                  <Text style={styles.stageCell}>{item.range}</Text>
                  <Text style={styles.stageCellDescription}>
                    {item.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>注意事項</Text>
            <View style={styles.cautionBox}>
              <Text style={styles.cautionText}>
                本アプリで算出される値は参考情報です。診断や治療を行う際には医師の判断が必要です。
                本アプリは医学的アドバイス、診断、または治療を提供するものではありません。
                {'\n\n'}
                医療上の決定を行う前に、必ず医師に相談してください。
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>参考文献・引用元</Text>
            <Text style={styles.description}>
              以下は本アプリで用いた計算式の出典元リンクです。詳細な計算根拠や最新ガイドラインは各リンク先をご確認ください。
            </Text>

            {/* ここでインラインスタイルを用いていた箇所を修正 */}
            <View style={styles.marginTop16}>
              <Text style={styles.subtitle}>eGFR (日本腎臓学会推奨式)</Text>
              <LinkText
                href="https://cdn.jsn.or.jp/data/CKD2018.pdf"
                text="エビデンスに基づくCKD診療ガイドライン2018（日本腎臓学会）"
              />

              <Text style={styles.subtitle}>CCr (Cockcroft-Gault式)</Text>
              <LinkText
                href="https://pubmed.ncbi.nlm.nih.gov/1244564/"
                text="Cockcroft DW, Gault MH. Nephron. 1976;16(1):31-41."
              />

              <Text style={styles.subtitle}>BSA (藤本式)</Text>
              <LinkText
                href="https://cir.nii.ac.jp/crid/1390001206358904064"
                text="藤本 薫喜、渡辺 孟、他. 日本衛生学雑誌 1968;23(5):443-450."
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    backgroundColor: COLORS.surface,
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  introText: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.text.secondary,
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
    padding: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.highlight,
    marginTop: 12,
    marginBottom: 8,
  },
  formulaBox: {
    backgroundColor: COLORS.formula,
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
  },
  formula: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: COLORS.text.accent,
    marginVertical: 4,
  },
  parameterList: {
    marginVertical: 16,
  },
  parameter: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.text.secondary,
    marginTop: 8,
  },
  stageGrid: {
    marginTop: 16,
  },
  stageRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  stageCell: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  stageCellDescription: {
    flex: 2,
    fontSize: 15,
    color: COLORS.text.secondary,
  },
  cautionBox: {
    backgroundColor: COLORS.primaryLight,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  cautionText: {
    fontSize: 14,
    color: COLORS.text.accent,
    lineHeight: 20,
  },
  linkText: {
    fontSize: 14,
    color: '#0066cc',
    textDecorationLine: 'underline',
    marginBottom: 8,
  },
  marginTop16: {
    marginTop: 16,
  },
});

export default FormulasScreen;
