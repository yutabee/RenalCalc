// src/screens/DisclaimerScreen.tsx

import React from 'react';
import {Text, ScrollView} from 'react-native';
import {styles} from '../styles';

const DisclaimerScreen: React.FC = () => (
  <ScrollView style={styles.privacyContainer}>
    <Text style={styles.privacyTitle}>免責事項</Text>

    <Text style={styles.privacyParagraph}>
      本アプリ「RenalCalc」（以下、「本アプリ」といいます。）は、腎機能を評価するための参考値を提供するツールとして設計されています。しかし、本アプリで提供される情報および計算結果は、診断または治療の代替となるものではありません。本アプリを利用することで得られる計算結果は、あくまで参考値であり、最終的な診断や治療方針の決定には、必ず医師または他の有資格の医療従事者にご相談ください。
    </Text>

    <Text style={styles.privacyParagraph}>
      【1. 利用上の注意】{'\n'}
      本アプリで提供されるeGFR、CCr、BSA、CKD分類などの計算結果は、一般的な計算式に基づいて算出されており、ユーザーが入力した情報に依存します。特殊な病態（急性腎障害、極端な体格、サルコペニアなど）や、不正確な情報入力がある場合、正確な腎機能を反映しない可能性があります。
    </Text>

    <Text style={styles.privacyParagraph}>
      【2. 免責事項】{'\n'}
      本アプリは、以下の事項について一切の保証を行いません：{'\n'}
      ・計算結果の正確性、完全性、信頼性{'\n'}
      ・本アプリを使用した結果として生じた損害、損失、トラブル{'\n'}
      ・本アプリが提供する情報に基づく診断または治療結果{'\n\n'}
      ユーザーが本アプリを使用することで発生したいかなる損害についても、当方は一切責任を負いません。
    </Text>

    <Text style={styles.privacyParagraph}>
      【3. 医療従事者へのご相談】{'\n'}
      本アプリで提供される計算結果を元に、自己判断で治療や投薬を行うことは避けてください。診断および治療には、必ず医師などの専門家にご相談ください。ユーザーの個別の医療状況に応じた専門的な助言が必要です。
    </Text>

    <Text style={styles.privacyParagraph}>
      【4. 改訂】{'\n'}
      本アプリは機能改善や法令の変更などに伴い、事前通知なく免責事項を更新する場合があります。最新の免責事項は本アプリ内で随時確認できます。
    </Text>

    <Text style={styles.privacyParagraph}>
      【5. お問い合わせ先】{'\n'}
      本アプリに関するご質問やご意見は、以下のメールアドレスまでお問い合わせください：
      {'\n\n'}
      yutabeee@gmail.com
    </Text>

    <Text style={styles.privacyParagraph}>（最終更新日：2024年12月15日）</Text>
  </ScrollView>
);

export default DisclaimerScreen;
