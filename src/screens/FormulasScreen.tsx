// src/screens/FormulasScreen.tsx
import React from 'react';
import {Text, ScrollView} from 'react-native';
import {styles} from '../styles';

const FormulasScreen: React.FC = () => (
  <ScrollView style={styles.privacyContainer}>
    <Text style={styles.privacyTitle}>計算式一覧</Text>
    <Text style={styles.privacyParagraph}>
      このページでは、腎機能評価に用いる代表的な計算式である
      eGFR、CCr、および体表面積（BSA）の求め方、
      さらにCKD重症度分類と留意点について詳しく説明します。
      {'\n\n'}
      これらの計算式は、臨床現場で腎機能を把握したり、薬剤投与量を設計する際の指標として広く利用されています。
      ただし、いずれも推定値であり、患者個々の状況に応じて判断が必要です。
    </Text>

    {/* eGFR */}
    <Text style={styles.privacyTitle}>1. eGFR（推算糸球体濾過量）</Text>
    <Text style={styles.privacyParagraph}>
      **日本腎臓学会推奨式（S-Cr使用）**{'\n\n'}
      男性：eGFR = 194 × (S-Cr)^(-1.094) × (年齢)^(-0.287){'\n'}
      女性：eGFR = [194 × (S-Cr)^(-1.094) × (年齢)^(-0.287)] × 0.739{'\n\n'}
      ・S-Cr（血清クレアチニン）：mg/dL{'\n'}
      ・年齢：歳{'\n'}
      ・単位：mL/min/1.73m²{'\n\n'}
      eGFRは腎機能を概ね把握するための指標で、CKD（慢性腎臓病）の診断や進行度評価に用いられます。
      日本人に合わせて調整された推算式であるため、国内での臨床適用性が高いとされています。
    </Text>

    {/* CCr */}
    <Text style={styles.privacyTitle}>2. CCr（クレアチニンクリアランス）</Text>
    <Text style={styles.privacyParagraph}>
      **Cockcroft-Gault式**{'\n\n'}
      男性：CCr = ((140 - 年齢) × 体重) / (72 × S-Cr){'\n'}
      女性：CCr = ((140 - 年齢) × 体重 × 0.85) / (72 × S-Cr){'\n\n'}
      ・年齢：歳{'\n'}
      ・体重：kg（標準体重でなく実測体重を用いる場合が多いが、肥満者は理想体重検討）
      {'\n'}
      ・S-Cr：mg/dL{'\n'}
      ・単位：mL/min{'\n\n'}
      CCrはGFRの近似値とされますが、尿細管分泌の影響によりGFRより高めに推定される傾向があります。
      臨床では薬剤投与量調整の目安に用いられることが多いですが、個々の体格差や病態を考慮した判断が必要です。
    </Text>

    {/* BSA */}
    <Text style={styles.privacyTitle}>3. 体表面積（BSA）</Text>
    <Text style={styles.privacyParagraph}>
      **藤本式**（Fujimoto formula）{'\n\n'}
      BSA = 0.008883 × (体重^(0.444)) × (身長^(0.663)){'\n\n'}
      ・体重：kg{'\n'}
      ・身長：cm{'\n'}
      ・単位：m²{'\n\n'}
      BSAは薬剤用量計算や腎機能値補正の際の基準値として1.73m²が用いられます。
      患者固有の体格差を補正し、異なる体格間でも腎機能を比較しやすくします。
    </Text>

    {/* CKD重症度分類 */}
    <Text style={styles.privacyTitle}>4. CKD重症度分類（Gステージ）</Text>
    <Text style={styles.privacyParagraph}>
      CKDはeGFRを基にGステージに分類され、腎機能低下の程度を評価します：{'\n\n'}
      G1: eGFR ≥ 90 mL/min/1.73m² （正常または高値）{'\n'}
      G2: 60-89 mL/min/1.73m² （軽度低下）{'\n'}
      G3a: 45-59 mL/min/1.73m² （軽度～中等度低下）{'\n'}
      G3b: 30-44 mL/min/1.73m² （中等度～高度低下）{'\n'}
      G4: 15-29 mL/min/1.73m² （高度低下）{'\n'}
      G5: ＜15 mL/min/1.73m² （末期腎不全）{'\n\n'}
      この分類によって、CKDの進行度合いや治療・検査のタイミングが判断しやすくなります。
    </Text>

    {/* 注意事項 */}
    <Text style={styles.privacyTitle}>5. 注意事項および参考文献</Text>
    <Text style={styles.privacyParagraph}>
      ・eGFRやCCrは推定値であり、筋肉量が大きく異なる患者（高齢者、サルコペニア、アスリート等）や
      急性腎障害下では精度が低下する可能性があります。{'\n'}
      ・CCrは尿細管分泌のためGFRより高く出ることがあり、理想体重使用が望ましい場合があります。
      {'\n'}
      ・最終的な治療・投薬判断には、他の検査所見（尿検査、画像、臨床症状）を含めた総合的判断が必須です。
      {'\n\n'}
      参考文献：{'\n'}- 日本腎臓学会「CKD診療ガイドライン2018・2022年版」{'\n'}-
      Matsuo S, et al. Am J Kidney Dis. 2009;53(6):982-92.{'\n'}- Cockcroft DW,
      Gault MH. Nephron. 1976;16(1):31-41.
    </Text>

    <Text style={styles.privacyParagraph}>
      ※本アプリで算出した値はあくまで参考であり、必ず医師などの専門家の指示を仰いでください。
    </Text>
  </ScrollView>
);

export default FormulasScreen;
