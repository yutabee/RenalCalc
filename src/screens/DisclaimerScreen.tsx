import React from 'react';
import {View, Text, ScrollView, StyleSheet, SafeAreaView} from 'react-native';
import {CONTACT_EMAIL} from '../constants/contact';
import {colors, spacing, typography} from '../theme';

interface Section {
  title: string;
  content: string | string[];
}

const sections: Section[] = [
  {
    title: '1. 利用上の注意',
    content:
      '本アプリ「RenalCalc」で提供される腎機能評価指標（eGFR、CCr、BSA、CKD分類など）は、一般的な計算式および参考文献に基づき算出されます。特定の病態や入力情報の不正確性によっては、実際の状態を正しく反映しない可能性があります。',
  },
  {
    title: '2. 免責事項',
    content: [
      '• 本アプリが提供する情報（計算結果、説明文、参考値）は、医学的アドバイス、診断、治療を目的とするものではありません。',
      '• 本アプリで得た計算結果や情報をもとにして直接的な診断・治療行為を行うことは避けてください。必ず医師や医療専門家に相談した上で、医療行為を判断してください。',
      '• 本アプリの利用によって生じたいかなる損害、損失、トラブルについて、当方は一切責任を負いません。',
    ],
  },
  {
    title: '3. 医療従事者へのご相談',
    content:
      '本アプリの情報や計算結果はあくまで参考値です。最終的な診断や治療方針の決定には必ず医師などの医療専門家に相談してください。あなたの個別状況に合わせた専門的な判断が必要です。',
  },
  {
    title: '4. 参考文献（出典）',
    content: [
      '本アプリで使用している主な計算式やガイドラインの参考文献・リンクは以下をご確認ください：',
      '• eGFR（日本腎臓学会推奨式）：\n  https://cdn.jsn.or.jp/data/CKD2018.pdf',
      '• CCr（Cockcroft-Gault式）：\n  https://pubmed.ncbi.nlm.nih.gov/1244564/',
      '• BSA（藤本式）：\n  https://cir.nii.ac.jp/crid/1390001206358904064',
      '',
      'これらの出典元は常に最新の医学知見に基づいて変更される可能性があります。最新情報や詳細は、上記リンク先や関連する医学文献、ガイドラインをご参照ください。',
    ],
  },
  {
    title: '5. 改訂',
    content:
      '本アプリは、機能改善や法令の変更に伴い、予告なく免責事項を変更する場合があります。常に最新の免責事項および参考文献情報を確認するよう心掛けてください。',
  },
  {
    title: '6. お問い合わせ先',
    content: [
      '本アプリに関するご質問・ご意見は下記メールアドレスまでお願いいたします：',
      CONTACT_EMAIL,
    ],
  },
];

const DisclaimerScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>免責事項</Text>
          <Text style={styles.subtitle}>
            「RenalCalc」は腎機能評価の参考値を提供するツールです。本アプリの情報は医療行為の判断材料となるものではなく、医学的なアドバイスや診断・治療行為の代替にはなりえません。医療上の判断、診断、治療方針の決定に際しては、必ず医師または医療専門家の助言を求めてください。
          </Text>
        </View>

        <View style={styles.content}>
          {sections.map((section, index) => (
            <View
              key={section.title}
              style={[
                styles.section,
                index === sections.length - 1 && styles.lastSection,
              ]}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {Array.isArray(section.content) ? (
                section.content.map((text, i) => (
                  <Text key={i} style={styles.paragraph}>
                    {text}
                  </Text>
                ))
              ) : (
                <Text style={styles.paragraph}>{section.content}</Text>
              )}
            </View>
          ))}
        </View>

        <Text style={styles.updateDate}>（最終更新日：2024年12月16日）</Text>
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
  },
  content: {
    padding: spacing.gutter,
  },
  section: {
    marginBottom: spacing.xxxl,
    paddingBottom: spacing.xxxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  lastSection: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  paragraph: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  updateDate: {
    ...typography.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});

export default DisclaimerScreen;
