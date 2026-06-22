import React from 'react';
import {describe, it, expect, jest} from '@jest/globals';
import {render, fireEvent} from '@testing-library/react-native';
import {ActionButton} from '../ActionButton';

describe('ActionButton', () => {
  it('renders the title', () => {
    const {getByText} = render(
      <ActionButton title="計算する" onPress={jest.fn()} />,
    );

    expect(getByText('計算する')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const {getByRole} = render(
      <ActionButton title="計算する" onPress={onPress} />,
    );

    fireEvent.press(getByRole('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const {getByRole} = render(
      <ActionButton title="計算する" onPress={onPress} disabled />,
    );

    fireEvent.press(getByRole('button'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('hides the title and does not call onPress when loading', () => {
    const onPress = jest.fn();
    const {getByRole, queryByText} = render(
      <ActionButton title="計算する" onPress={onPress} loading />,
    );

    fireEvent.press(getByRole('button'));

    expect(queryByText('計算する')).toBeNull();
    expect(onPress).not.toHaveBeenCalled();
  });

  it('animates the press-in / press-out without error', () => {
    const {getByRole} = render(
      <ActionButton title="計算する" onPress={jest.fn()} />,
    );
    const button = getByRole('button');

    fireEvent(button, 'pressIn');
    fireEvent(button, 'pressOut');

    expect(button).toBeTruthy();
  });

  it('renders the secondary and tertiary variants', () => {
    const {getByText, rerender} = render(
      <ActionButton title="詳細" onPress={jest.fn()} variant="secondary" />,
    );
    expect(getByText('詳細')).toBeTruthy();

    rerender(
      <ActionButton title="詳細" onPress={jest.fn()} variant="tertiary" />,
    );
    expect(getByText('詳細')).toBeTruthy();
  });
});
