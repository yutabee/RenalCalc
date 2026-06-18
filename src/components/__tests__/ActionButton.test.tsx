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
});
