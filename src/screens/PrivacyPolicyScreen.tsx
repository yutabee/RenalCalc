// src/screens/PrivacyPolicyScreen.tsx

import React from 'react';
import {Text, ScrollView} from 'react-native';
import {styles} from '../styles';

const PrivacyPolicyScreen: React.FC = () => (
  <ScrollView style={styles.privacyContainer}>
    <Text style={styles.privacyTitle}>プライバシーポリシー</Text>

    <Text style={styles.privacyParagraph}>
      本プライバシーポリシー（以下、「本ポリシー」といいます。）は、RenalCalc（以下、「本アプリ」といいます。）をご利用いただく皆様（以下、「ユーザー」といいます。）の個人情報および関連情報の取扱いについて定めるものです。本アプリは、個人情報の保護に関する法令を遵守し、ユーザーの皆様が安心してご利用いただけるよう努めます。
    </Text>

    <Text style={styles.privacyParagraph}>
      【1. 適用範囲】{'\n'}
      本ポリシーは、本アプリの利用に関連して取得する情報の取扱いに適用されます。本アプリ内で入力された情報や操作ログが対象となります。
    </Text>

    <Text style={styles.privacyParagraph}>
      【2. 取得する情報】{'\n'}
      本アプリは、ユーザーが入力する以下の情報を取得します：{'\n\n'}
      ・年齢{'\n'}
      ・性別{'\n'}
      ・身長、体重{'\n'}
      ・血清クレアチニン値（S-Cr）{'\n\n'}
      ※これらの情報は腎機能評価（eGFRやCCrの推定）の計算に使用されますが、外部サーバーに送信されることはなく、デバイス内で処理されます。
    </Text>

    <Text style={styles.privacyParagraph}>
      【3. 情報の利用目的】{'\n'}
      本アプリで取得した情報は、以下の目的で利用します：{'\n'}
      ・腎機能評価（eGFR、CCrなど）の計算および表示{'\n'}
      ・ユーザー体験向上のための匿名化データによる利用状況の分析
    </Text>

    <Text style={styles.privacyParagraph}>
      【4. 情報の保管と共有】{'\n'}
      本アプリで入力された情報は、アプリ内でのみ処理され、外部サーバーに送信・共有されることはありません。ユーザーがアプリを終了すると、入力情報は保持されず消去されます。
    </Text>

    <Text style={styles.privacyParagraph}>
      【5. 第三者提供】{'\n'}
      本アプリは、法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。
    </Text>

    <Text style={styles.privacyParagraph}>
      【6. 安全管理措置】{'\n'}
      当方は、取得した情報を安全に管理し、不正アクセス、漏えい、紛失、毀損の防止に努めます。また、匿名化された利用状況データを使用する場合も、個人が特定されないよう適切な管理を行います。
    </Text>

    <Text style={styles.privacyParagraph}>
      【7. ユーザーの権利】{'\n'}
      ユーザーは、本アプリの利用を中止し、アプリをアンインストールすることで以後の情報取得を停止できます。
    </Text>

    <Text style={styles.privacyParagraph}>
      【8. クッキーおよびトラッキング技術】{'\n'}
      本アプリでは、クッキーや類似のトラッキング技術を使用していません。
    </Text>

    <Text style={styles.privacyParagraph}>
      【9. 改定について】{'\n'}
      本ポリシーは、法令の変更や本アプリの機能追加などにより改定される場合があります。改定が行われた場合、最新のプライバシーポリシーを本アプリ内で表示します。
    </Text>

    <Text style={styles.privacyParagraph}>
      【10. お問い合わせ先】{'\n'}
      本ポリシーに関するお問い合わせは、以下のメールアドレスまでお願いいたします：
      {'\n\n'}
      yutabeee@gmail.com
    </Text>

    <Text style={styles.privacyParagraph}>（最終更新日：2024年12月15日）</Text>
  </ScrollView>
);

export default PrivacyPolicyScreen;
