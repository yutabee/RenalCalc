import React from 'react';
import {describe, it, expect, jest} from '@jest/globals';
import {render, fireEvent} from '@testing-library/react-native';
import {InputField} from '../InputField';

describe('InputField', () => {
  it('renders the label and unit text', () => {
    const {getByText} = render(
      <InputField label="血清クレアチニン" unit="mg/dL" />,
    );

    expect(getByText('血清クレアチニン')).toBeTruthy();
    expect(getByText('mg/dL')).toBeTruthy();
  });

  it('renders the placeholder', () => {
    const {getByPlaceholderText} = render(
      <InputField label="年齢" unit="歳" placeholder="18-120" />,
    );

    expect(getByPlaceholderText('18-120')).toBeTruthy();
  });

  it('fires onChangeText with the new value when typing', () => {
    const onChangeText = jest.fn();
    const {getByPlaceholderText} = render(
      <InputField
        label="身長"
        unit="cm"
        placeholder="120-200"
        value=""
        onChangeText={onChangeText}
      />,
    );

    fireEvent.changeText(getByPlaceholderText('120-200'), '170');

    expect(onChangeText).toHaveBeenCalledWith('170');
  });

  it('uses numeric as the default keyboardType', () => {
    const {getByPlaceholderText} = render(
      <InputField label="体重" unit="kg" placeholder="30-150" />,
    );

    expect(getByPlaceholderText('30-150').props.keyboardType).toBe('numeric');
  });

  it('allows keyboardType to override the default', () => {
    const {getByPlaceholderText} = render(
      <InputField
        label="血清クレアチニン"
        unit="mg/dL"
        placeholder="0.3-15.0"
        keyboardType="decimal-pad"
      />,
    );

    expect(getByPlaceholderText('0.3-15.0').props.keyboardType).toBe(
      'decimal-pad',
    );
  });

  it('renders an inline error message when error is provided', () => {
    const {getByText} = render(
      <InputField
        label="年齢"
        unit="歳"
        error="18〜120の範囲で入力してください"
      />,
    );

    expect(getByText('18〜120の範囲で入力してください')).toBeTruthy();
  });

  it('does not render an error message when error is absent', () => {
    const {queryByText} = render(<InputField label="年齢" unit="歳" />);

    expect(queryByText('18〜120の範囲で入力してください')).toBeNull();
  });

  it('calls through prop-provided onFocus and onBlur handlers', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const {getByPlaceholderText} = render(
      <InputField
        label="体重"
        unit="kg"
        placeholder="30-150"
        onFocus={onFocus}
        onBlur={onBlur}
      />,
    );

    const input = getByPlaceholderText('30-150');
    fireEvent(input, 'focus');
    fireEvent(input, 'blur');

    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
