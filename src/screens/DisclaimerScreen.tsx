import React from 'react';
import {View, Text} from 'react-native';
import {styles} from '../styles';

const DisclaimerScreen: React.FC = () => (
  <View style={styles.privacyContainer}>
    <Text style={styles.privacyTitle}>免責事項</Text>
    <Text style={styles.privacyParagraph}>
      ここに免責事項の詳細を記載します。
    </Text>
  </View>
);

export default DisclaimerScreen;
