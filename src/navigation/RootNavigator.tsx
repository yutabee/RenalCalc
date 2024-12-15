import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import FormulasScreen from '../screens/FormulasScreen';
import DisclaimerScreen from '../screens/DisclaimerScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{title: '腎機能評価ツール'}}
      />
      <Stack.Screen
        name="Formulas"
        component={FormulasScreen}
        options={{title: '計算式一覧'}}
      />
      <Stack.Screen
        name="Disclaimer"
        component={DisclaimerScreen}
        options={{title: '免責事項'}}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{title: 'プライバシーポリシー'}}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
