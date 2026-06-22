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
import {
  colors,
  spacing,
  radius,
  typography,
  hairline,
  cardShadow,
  stageColors,
} from '../theme';

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

interface Stage {
  stage: 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5';
  range: string;
  description: string;
}

const stages: Stage[] = [
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
  <TouchableOpacity
    onPress={() => Linking.openURL(href)}
    accessibilityRole="link"
    accessibilityLabel={text}>
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
          <Text style={styles.eyebrow}>リファレンス</Text>
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
            <View style={styles.stageTable}>
              <View style={styles.stageHeaderRow}>
                <Text style={[styles.stageHeaderCell, styles.stageColStage]}>
                  ステージ
                </Text>
                <Text style={[styles.stageHeaderCell, styles.stageColRange]}>
                  GFR
                </Text>
                <Text style={[styles.stageHeaderCell, styles.stageColDesc]}>
                  状態
                </Text>
              </View>
              {stages.map((item, index) => (
                <View key={index} style={styles.stageRow}>
                  <View
                    style={[
                      styles.stageRail,
                      {backgroundColor: stageColors[item.stage]},
                    ]}
                  />
                  <Text style={[styles.stageCell, styles.stageColStage]}>
                    {item.stage}
                  </Text>
                  <Text style={[styles.stageRange, styles.stageColRange]}>
                    {item.range}
                  </Text>
                  <Text
                    style={[styles.stageCellDescription, styles.stageColDesc]}>
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

            <View style={styles.referenceList}>
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
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  header: {
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    borderBottomWidth: hairline.borderWidth,
    borderBottomColor: hairline.borderColor,
  },
  eyebrow: {
    ...typography.eyebrow,
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  introText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  content: {
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.xxxl,
  },
  section: {
    marginBottom: spacing.xxxl,
    padding: spacing.card,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...hairline,
    ...cardShadow,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  formulaBox: {
    backgroundColor: colors.inputBg,
    padding: spacing.lg,
    borderRadius: radius.md,
    marginVertical: spacing.lg,
  },
  formula: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: colors.text.primary,
    marginVertical: spacing.xs,
  },
  parameterList: {
    marginVertical: spacing.lg,
  },
  parameter: {
    ...typography.label,
    fontWeight: '400',
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  stageTable: {
    marginTop: spacing.lg,
  },
  stageHeaderRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    paddingLeft: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  stageHeaderCell: {
    ...typography.eyebrow,
    letterSpacing: 0.4,
    color: colors.text.tertiary,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingLeft: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  stageRail: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderRadius: radius.sm,
  },
  stageColStage: {
    flex: 1.2,
  },
  stageColRange: {
    flex: 1.2,
  },
  stageColDesc: {
    flex: 2.6,
  },
  stageCell: {
    ...typography.data,
    fontWeight: '600',
    color: colors.text.primary,
  },
  stageRange: {
    ...typography.data,
    fontWeight: '600',
    color: colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  stageCellDescription: {
    ...typography.data,
    color: colors.text.secondary,
  },
  cautionBox: {
    backgroundColor: colors.inputBg,
    paddingVertical: spacing.md,
    paddingRight: spacing.lg,
    paddingLeft: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    borderRadius: radius.sm,
    marginTop: spacing.sm,
  },
  cautionText: {
    ...typography.label,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.text.secondary,
  },
  linkText: {
    ...typography.label,
    fontWeight: '400',
    color: colors.link,
    textDecorationLine: 'underline',
    marginBottom: spacing.sm,
  },
  referenceList: {
    marginTop: spacing.lg,
  },
});

export default FormulasScreen;
