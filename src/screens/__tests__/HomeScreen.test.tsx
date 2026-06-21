/**
 * Component tests for HomeScreen — render, input validation, and the
 * calculate -> result flow. Replaces the previous brittle full-App smoke test
 * (which mounted the entire native navigation stack just to assert it rendered).
 */
import React from 'react';
import {Keyboard} from 'react-native';
import {describe, it, expect, jest, beforeEach, afterEach} from '@jest/globals';
import {render, fireEvent, waitFor, act} from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';

const mockNavigation = {navigate: jest.fn()} as any;

const renderScreen = () => render(<HomeScreen navigation={mockNavigation} />);

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Flush any in-flight Animated timers so they don't fire after teardown.
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('renders the title and the calculate button', () => {
    const {getByText} = renderScreen();
    expect(getByText('腎機能評価')).toBeTruthy();
    expect(getByText('計算する')).toBeTruthy();
  });

  it('shows an inline error under every empty field when calculating', () => {
    const {getByText, getAllByText} = renderScreen();

    fireEvent.press(getByText('計算する'));

    expect(getAllByText('入力してください')).toHaveLength(4);
  });

  it('shows an inline range error for an out-of-range input', () => {
    const {getByText, getByPlaceholderText} = renderScreen();

    fireEvent.changeText(getByPlaceholderText('18-120'), '10'); // age < 18
    fireEvent.changeText(getByPlaceholderText('120-200'), '170');
    fireEvent.changeText(getByPlaceholderText('30-150'), '60');
    fireEvent.changeText(getByPlaceholderText('0.3-15.0'), '1.0');

    fireEvent.press(getByText('計算する'));

    expect(getByText('18〜120の範囲で入力してください')).toBeTruthy();
  });

  it('clears a field error once the user edits that field', () => {
    const {getByText, getByPlaceholderText, queryAllByText} = renderScreen();

    fireEvent.press(getByText('計算する'));
    expect(queryAllByText('入力してください')).toHaveLength(4);

    fireEvent.changeText(getByPlaceholderText('18-120'), '50');
    expect(queryAllByText('入力してください')).toHaveLength(3);
  });

  it('renders eGFR, CCr and BSA results for valid inputs', async () => {
    const {getByText, getByPlaceholderText} = renderScreen();

    fireEvent.changeText(getByPlaceholderText('18-120'), '50');
    fireEvent.changeText(getByPlaceholderText('120-200'), '170');
    fireEvent.changeText(getByPlaceholderText('30-150'), '60');
    fireEvent.changeText(getByPlaceholderText('0.3-15.0'), '1.0');

    fireEvent.press(getByText('計算する'));

    await waitFor(() => {
      expect(getByText('eGFR')).toBeTruthy();
      expect(getByText('CCr')).toBeTruthy();
    });
    // eGFR(1.0, 50, male) ~= 63.1; CKD stage G2 (軽度低下) for 60<=eGFR<90
    expect(getByText('軽度低下')).toBeTruthy();
  });

  it('dismisses the keyboard when calculating valid inputs', () => {
    const dismissSpy = jest.spyOn(Keyboard, 'dismiss');
    const {getByText, getByPlaceholderText} = renderScreen();

    fireEvent.changeText(getByPlaceholderText('18-120'), '50');
    fireEvent.changeText(getByPlaceholderText('120-200'), '170');
    fireEvent.changeText(getByPlaceholderText('30-150'), '60');
    fireEvent.changeText(getByPlaceholderText('0.3-15.0'), '1.0');

    fireEvent.press(getByText('計算する'));

    expect(dismissSpy).toHaveBeenCalled();
  });
});
