/**
 * Guards that the privacy policy renders its full set of sections — a previous
 * version shipped with a "// ...他のセクションも同様に定義" placeholder that left
 * the policy incomplete in production.
 */
import React from 'react';
import {describe, it, expect} from '@jest/globals';
import {render} from '@testing-library/react-native';
import PrivacyPolicyScreen from '../PrivacyPolicyScreen';
import {CONTACT_EMAIL} from '../../constants/contact';

describe('PrivacyPolicyScreen', () => {
  it('renders the core policy sections and contact email', () => {
    const {getByText} = render(<PrivacyPolicyScreen />);

    expect(getByText('1. 適用範囲')).toBeTruthy();
    expect(getByText('3. 利用目的')).toBeTruthy();
    expect(getByText('5. 第三者提供・外部送信')).toBeTruthy();
    expect(getByText('7. 本ポリシーの変更')).toBeTruthy();
    expect(getByText(CONTACT_EMAIL)).toBeTruthy();
  });
});
