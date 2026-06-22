import React from 'react';
import {describe, it, expect} from '@jest/globals';
import {render} from '@testing-library/react-native';
import DisclaimerScreen from '../DisclaimerScreen';
import {CONTACT_EMAIL} from '../../constants/contact';

describe('DisclaimerScreen', () => {
  it('renders the title, every section, and the contact email', () => {
    const {getByText} = render(<DisclaimerScreen />);

    expect(getByText('免責事項')).toBeTruthy();
    expect(getByText('1. 利用上の注意')).toBeTruthy();
    expect(getByText('2. 免責事項')).toBeTruthy();
    expect(getByText('4. 参考文献（出典）')).toBeTruthy();
    expect(getByText('6. お問い合わせ先')).toBeTruthy();
    expect(getByText(CONTACT_EMAIL)).toBeTruthy();
  });
});
