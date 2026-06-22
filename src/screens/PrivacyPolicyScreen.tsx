import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Linking,
} from 'react-native';
import {CONTACT_EMAIL} from '../constants/contact';
import {
  colors,
  spacing,
  radius,
  typography,
  hairline,
  cardShadow,
} from '../theme';

interface Section {
  id: string;
  title: string;
  content: string | string[];
  highlight?: boolean;
}

const sections: Section[] = [
  {
    id: 'intro',
    title: '',
    content:
      '本プライバシーポリシーは、RenalCalcをご利用いただく皆様の個人情報および関連情報の取扱いについて定めるものです。本アプリは、個人情報の保護に関する法令を遵守し、ユーザーの皆様が安心してご利用いただけるよう努めます。',
    highlight: true,
  },
  {
    id: 'scope',
    title: '1. 適用範囲',
    content:
      '本ポリシーは、本アプリの利用に関連して取得する情報の取扱いに適用されます。本アプリ内で入力された情報や操作ログが対象となります。',
  },
  {
    id: 'collection',
    title: '2. 取得する情報',
    content: [
      '本アプリは、ユーザーが入力する以下の情報を取得します：',
      '• 年齢',
      '• 性別',
      '• 身長、体重',
      '• 血清クレアチニン値（S-Cr）',
      '',
      '※これらの情報は腎機能評価の計算に使用されますが、外部サーバーに送信されることはなく、デバイス内で処理されます。',
    ],
  },
  {
    id: 'purpose',
    title: '3. 利用目的',
    content:
      '取得した情報は、eGFR・CCr・BSA・CKD病期などの腎機能評価指標を算出し、その結果を画面上に表示する目的のみに利用します。これ以外の目的には利用しません。',
  },
  {
    id: 'storage',
    title: '4. 情報の保存と管理',
    content: [
      '入力された情報は計算のために一時的に端末上で処理されるのみで、アプリが外部に送信・保存することはありません。',
      'アプリを終了すると、入力内容は保持されません（端末やOSのキーボード入力履歴等は本アプリの管理対象外です）。',
    ],
  },
  {
    id: 'third-party',
    title: '5. 第三者提供・外部送信',
    content: [
      '本アプリは、ユーザーの入力情報を第三者へ提供することはありません。',
      'また、解析ツール（アクセス解析・クラッシュレポート等）や広告SDKを利用しておらず、利用状況の外部送信も行いません。',
    ],
  },
  {
    id: 'children',
    title: '6. 適用対象',
    content:
      '本アプリは医療従事者を含む一般の利用者を想定した参考ツールです。算出結果は参考値であり、診断・治療の根拠とはなりません。',
  },
  {
    id: 'changes',
    title: '7. 本ポリシーの変更',
    content:
      '本ポリシーは、機能の改善や関連法令の変更に伴い、予告なく改定する場合があります。重要な変更がある場合はアプリの更新に合わせて本画面で告知します。',
  },
];

const PrivacyPolicyScreen: React.FC = () => {
  const handleEmailPress = () => {
    Linking.openURL(`mailto:${CONTACT_EMAIL}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>プライバシーポリシー</Text>
        </View>

        <View style={styles.content}>
          {sections.map(section => (
            <View
              key={section.id}
              style={[
                styles.section,
                section.highlight && styles.highlightSection,
              ]}>
              {section.title && (
                <Text style={styles.sectionTitle}>{section.title}</Text>
              )}
              {Array.isArray(section.content) ? (
                section.content.map((text, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.paragraph,
                      text.startsWith('•') && styles.bulletPoint,
                    ]}>
                    {text}
                  </Text>
                ))
              ) : (
                <Text style={styles.paragraph}>{section.content}</Text>
              )}
            </View>
          ))}

          <View style={styles.contact}>
            <Text style={styles.contactText}>
              本ポリシーに関するお問い合わせは、以下のメールアドレスまでお願いいたします：
            </Text>
            <Text style={styles.email} onPress={handleEmailPress}>
              {CONTACT_EMAIL}
            </Text>
          </View>

          <Text style={styles.updateDate}>（最終更新日：2024年12月15日）</Text>
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
  },
  content: {
    padding: spacing.gutter,
  },
  section: {
    backgroundColor: colors.surface,
    ...hairline,
    borderRadius: radius.lg,
    padding: spacing.card,
    marginBottom: spacing.lg,
    ...cardShadow,
  },
  highlightSection: {
    backgroundColor: colors.inputBg,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  paragraph: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  bulletPoint: {
    paddingLeft: spacing.sm,
  },
  contact: {
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  contactText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  email: {
    ...typography.body,
    color: colors.link,
    fontWeight: '500',
    textDecorationLine: 'underline',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  updateDate: {
    ...typography.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});

export default PrivacyPolicyScreen;
