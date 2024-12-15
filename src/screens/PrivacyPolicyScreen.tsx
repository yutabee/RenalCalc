import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
  Linking,
} from 'react-native';

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
  highlight: '#F1F5F9',
};

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
  // ... 他のセクションも同様に定義
];

const PrivacyPolicyScreen: React.FC = () => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:yutabeee@gmail.com');
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
              yutabeee@gmail.com
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
    letterSpacing: 0.5,
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
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
  highlightSection: {
    backgroundColor: COLORS.highlight,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.accent,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.text.secondary,
    marginBottom: 12,
  },
  bulletPoint: {
    paddingLeft: 8,
  },
  contact: {
    marginTop: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  contactText: {
    fontSize: 15,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: COLORS.text.accent,
    fontWeight: '500',
    textDecorationLine: 'underline',
    padding: 8,
  },
  updateDate: {
    fontSize: 13,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default PrivacyPolicyScreen;
