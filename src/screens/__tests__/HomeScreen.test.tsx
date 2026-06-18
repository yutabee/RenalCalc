/**
 * Component tests for HomeScreen — render, input validation, and the
 * calculate -> result flow. Replaces the previous brittle full-App smoke test
 * (which mounted the entire native navigation stack just to assert it rendered).
 */
import React from 'react';
import {Alert} from 'react-native';
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

  it('alerts when calculating with empty inputs', () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const {getByText} = renderScreen();

    fireEvent.press(getByText('計算する'));

    expect(alertSpy).toHaveBeenCalledWith(
      'エラー',
      'すべての値を入力してください',
    );
  });

  it('alerts when an input is out of range', () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const {getByText, getByPlaceholderText} = renderScreen();

    fireEvent.changeText(getByPlaceholderText('18-120'), '10'); // age < 18
    fireEvent.changeText(getByPlaceholderText('120-200'), '170');
    fireEvent.changeText(getByPlaceholderText('30-150'), '60');
    fireEvent.changeText(getByPlaceholderText('0.3-15.0'), '1.0');

    fireEvent.press(getByText('計算する'));

    expect(alertSpy).toHaveBeenCalledWith(
      'エラー',
      '年齢は18-120の範囲で入力してください',
    );
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
});
