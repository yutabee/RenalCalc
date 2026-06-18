import React from 'react';
import {Linking} from 'react-native';
import {describe, it, expect, jest, beforeEach, afterEach} from '@jest/globals';
import {render, fireEvent} from '@testing-library/react-native';
import FormulasScreen from '../FormulasScreen';

describe('FormulasScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the three formula section titles', () => {
    const {getByText} = render(<FormulasScreen />);

    expect(getByText('1. eGFR（推算糸球体濾過量）')).toBeTruthy();
    expect(getByText('2. CCr（クレアチニンクリアランス）')).toBeTruthy();
    expect(getByText('3. 体表面積（BSA）')).toBeTruthy();
  });

  it('renders the CKD stage codes', () => {
    const {getByText} = render(<FormulasScreen />);

    expect(getByText('G1')).toBeTruthy();
    expect(getByText('G2')).toBeTruthy();
    expect(getByText('G3a')).toBeTruthy();
    expect(getByText('G3b')).toBeTruthy();
    expect(getByText('G4')).toBeTruthy();
    expect(getByText('G5')).toBeTruthy();
  });

  it('opens the JSN reference link', () => {
    const openURLSpy = jest
      .spyOn(Linking, 'openURL')
      .mockResolvedValue(undefined);
    const {getByText} = render(<FormulasScreen />);

    fireEvent.press(
      getByText('エビデンスに基づくCKD診療ガイドライン2018（日本腎臓学会）'),
    );

    expect(openURLSpy).toHaveBeenCalledWith(
      'https://cdn.jsn.or.jp/data/CKD2018.pdf',
    );
  });
});
