import React from 'react';
import {describe, it, expect, jest, beforeEach, afterEach} from '@jest/globals';
import {render, act} from '@testing-library/react-native';
import {ResultCard} from '../ResultCard';

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

  it('renders the stage badge and description when stage is provided', () => {
    const {getByText} = render(
      <ResultCard
        title="eGFR"
        value={63.1}
        unit="mL/min/1.73m²"
        stage={{stage: 'G2', description: '軽度低下', color: '#8BC34A'}}
      />,
    );

    expect(getByText('G2')).toBeTruthy();
    expect(getByText('軽度低下')).toBeTruthy();
  });

  it('does not render a stage description without a stage prop', () => {
    const {queryByText} = render(
      <ResultCard title="eGFR" value={63.1} unit="mL/min/1.73m²" />,
    );

    expect(queryByText('軽度低下')).toBeNull();
  });

  it('renders the up trend arrow', () => {
    const {getByText} = render(
      <ResultCard title="eGFR" value={63.1} unit="mL/min/1.73m²" trend="up" />,
    );

    expect(getByText('↑')).toBeTruthy();
  });

  it('renders the down trend arrow', () => {
    const {getByText} = render(
      <ResultCard
        title="eGFR"
        value={63.1}
        unit="mL/min/1.73m²"
        trend="down"
      />,
    );

    expect(getByText('↓')).toBeTruthy();
  });

  it('renders the stable trend arrow', () => {
    const {getByText} = render(
      <ResultCard
        title="eGFR"
        value={63.1}
        unit="mL/min/1.73m²"
        trend="stable"
      />,
    );

    expect(getByText('→')).toBeTruthy();
  });
});
