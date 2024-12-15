import React from 'react';
import {View, Text} from 'react-native';
import {styles} from '../styles';

const PrivacyPolicyScreen: React.FC = () => (
  <View style={styles.privacyContainer}>
    <Text style={styles.privacyTitle}>プライバシーポリシー</Text>
    <Text style={styles.privacyParagraph}>
      ここにプライバシーポリシーの文言を記載します。
    </Text>
  </View>
);

export default PrivacyPolicyScreen;
