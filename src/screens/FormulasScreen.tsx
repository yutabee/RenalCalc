import React from 'react';
import {View, Text} from 'react-native';
import {styles} from '../styles';

const FormulasScreen: React.FC = () => (
  <View style={styles.privacyContainer}>
    <Text style={styles.privacyTitle}>計算式一覧</Text>
    <Text style={styles.privacyParagraph}>
      ここに計算式一覧の詳細を記載します。（eGFR・CCrなど）
    </Text>
  </View>
);

export default FormulasScreen;
