import React from 'react';
import {View, Text, StyleSheet, ScrollView, SafeAreaView} from 'react-native';

const FormulasPage: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>各計算式について</Text>

        {/* eGFRの計算式 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. eGFR（推算糸球体濾過量）</Text>
          <Text style={styles.formulaLabel}>日本腎臓学会2018年版推算式</Text>
          <Text style={styles.formula}>
            eGFR = 141 × min(Scr/k, 1)<sup>α</sup> × max(Scr/k,1)
            <sup>-1.209</sup> × 0.993<sup>年齢</sup> × 性別補正 × 日本人係数
          </Text>
          <Text style={styles.explanation}>
            ここで、Scrは血清クレアチニン値、kは性別による定数（男性:0.9、女性:0.7）、αは性別による定数（男性:-0.411、女性:-0.329）、性別補正は女性の場合1.018（男性は1）、日本人係数は0.813を用います。
          </Text>
        </View>

        {/* Cockcroft-Gault式によるCCr */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            2. CCr（Cockcroft-Gault式＋日本人補正）
          </Text>
          <Text style={styles.formulaLabel}>
            Cockcroft-Gault式（日本人補正込み）
          </Text>
          <Text style={styles.formula}>
            CCr = ((140 - 年齢) × 体重(kg) × 性別補正) / (72 × Scr) × 日本人補正
          </Text>
          <Text style={styles.explanation}>
            性別補正：男性の場合1.0、女性の場合0.85を用います。
            日本人補正：0.84を使用します。
          </Text>
          <Text style={styles.explanation}>
            計算したCCrを 1.73m²換算するため、 CCr補正値 = CCr × (1.73 /
            体表面積(BSA))
          </Text>
        </View>

        {/* 体表面積の計算（藤本式） */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            3. 体表面積（BSA）計算（藤本式）
          </Text>
          <Text style={styles.formulaLabel}>藤本式</Text>
          <Text style={styles.formula}>
            BSA = 0.008883 × (体重(kg))<sup>0.444</sup> × (身長(cm))
            <sup>0.663</sup>
          </Text>
        </View>

        {/* CKD重症度分類 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. CKD重症度分類</Text>
          <Text style={styles.explanation}>
            日本腎臓学会ガイドラインに基づくGステージ分類例：
          </Text>
          <Text style={styles.listItem}>・G1: eGFR ≥ 90</Text>
          <Text style={styles.listItem}>・G2: 60 ≤ eGFR ＜ 90</Text>
          <Text style={styles.listItem}>・G3a: 45 ≤ eGFR ＜ 60</Text>
          <Text style={styles.listItem}>・G3b: 30 ≤ eGFR ＜ 45</Text>
          <Text style={styles.listItem}>・G4: 15 ≤ eGFR ＜ 30</Text>
          <Text style={styles.listItem}>・G5: eGFR ＜ 15</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FormulasPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
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
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  formulaLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  formula: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 12,
    lineHeight: 20,
  },
  explanation: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 20,
  },
  listItem: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
    lineHeight: 20,
  },
});
