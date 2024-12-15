import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';

// Constants
const COLORS = {
  primary: '#1B2B4B',
  background: '#F8F9FD',
  surface: '#FFFFFF',
  text: {
    primary: '#1A1A1A',
    secondary: '#6B7280',
    accent: '#1B2B4B',
  },
  divider: '#E2E8F0',
};

interface Section {
  title: string;
  content: string | string[];
}

const sections: Section[] = [
  {
    title: '1. 利用上の注意',
    content:
      '本アプリで提供されるeGFR、CCr、BSA、CKD分類などの計算結果は、一般的な計算式に基づいて算出されており、ユーザーが入力した情報に依存します。特殊な病態（急性腎障害、極端な体格、サルコペニアなど）や、不正確な情報入力がある場合、正確な腎機能を反映しない可能性があります。',
  },
  {
    title: '2. 免責事項',
    content: [
      '本アプリは、以下の事項について一切の保証を行いません：',
      '• 計算結果の正確性、完全性、信頼性',
      '• 本アプリを使用した結果として生じた損害、損失、トラブル',
      '• 本アプリが提供する情報に基づく診断または治療結果',
      '',
      'ユーザーが本アプリを使用することで発生したいかなる損害についても、当方は一切責任を負いません。',
    ],
  },
  {
    title: '3. 医療従事者へのご相談',
    content:
      '本アプリで提供される計算結果を元に、自己判断で治療や投薬を行うことは避けてください。診断および治療には、必ず医師などの専門家にご相談ください。ユーザーの個別の医療状況に応じた専門的な助言が必要です。',
  },
  {
    title: '4. 改訂',
    content:
      '本アプリは機能改善や法令の変更などに伴い、事前通知なく免責事項を更新する場合があります。最新の免責事項は本アプリ内で随時確認できます。',
  },
  {
    title: '5. お問い合わせ先',
    content: [
      '本アプリに関するご質問やご意見は、以下のメールアドレスまでお問い合わせください：',
      'yutabeee@gmail.com',
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
            本アプリ「RenalCalc」は、腎機能を評価するための参考値を提供するツールとして設計されています。本アプリで提供される情報および計算結果は、診断または治療の代替となるものではありません。
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

        <Text style={styles.updateDate}>（最終更新日：2024年12月15日）</Text>
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
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.text.secondary,
    fontWeight: '400',
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  lastSection: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.accent,
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.text.secondary,
    marginBottom: 12,
  },
  updateDate: {
    fontSize: 13,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: 24,
    fontWeight: '400',
  },
});

export default DisclaimerScreen;
