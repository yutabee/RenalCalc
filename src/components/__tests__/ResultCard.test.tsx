import React from 'react';
import {StyleSheet} from 'react-native';
import {describe, it, expect, jest, beforeEach, afterEach} from '@jest/globals';
import {render, act} from '@testing-library/react-native';
import {ResultCard} from '../ResultCard';
import {colors, stageColors, readableTextColor} from '../../theme';

describe('ResultCard', () => {
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

  it('renders the title, formatted value, and unit', () => {
    const {getByText} = render(
      <ResultCard title="eGFR" value={63.1} unit="mL/min/1.73m²" />,
    );

    expect(getByText('eGFR')).toBeTruthy();
    expect(getByText('63.1')).toBeTruthy();
    expect(getByText('mL/min/1.73m²')).toBeTruthy();
  });

  it('renders the stage badge and description with AA badge text on a real ramp hue', () => {
    const {getByText} = render(
      <ResultCard
        title="eGFR"
        value={63.1}
        unit="mL/min/1.73m²"
        stage={{stage: 'G2', description: '軽度低下', color: stageColors.G2}}
      />,
    );

    expect(getByText('G2')).toBeTruthy();
    expect(getByText('軽度低下')).toBeTruthy();
    // Badge text colour is chosen for contrast — every ramp hue resolves to white.
    const badgeStyle = StyleSheet.flatten(getByText('G2').props.style);
    expect(badgeStyle.color).toBe(readableTextColor(stageColors.G2));
    expect(badgeStyle.color).toBe(colors.text.onPrimary);
  });

  it('does not render a stage description without a stage prop', () => {
    const {queryByText} = render(
      <ResultCard title="eGFR" value={63.1} unit="mL/min/1.73m²" />,
    );

    expect(queryByText('軽度低下')).toBeNull();
  });
});
