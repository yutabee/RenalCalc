import {describe, it, expect} from '@jest/globals';
import {colors, stageColors, readableTextColor} from '../theme';

/**
 * Locks the WCAG invariant for the CKD severity ramp: every stage hue must
 * resolve to white badge text. G3a/G3b sit just under the 0.179 luminance flip,
 * so a future hue tweak that lightens them could silently drop below AA — this
 * test fails loudly if that happens.
 */
describe('CKD stage ramp contrast', () => {
  it('resolves every stage hue to white text', () => {
    Object.values(stageColors).forEach(hex => {
      expect(readableTextColor(hex)).toBe(colors.text.onPrimary);
    });
  });

  it('covers all six stages', () => {
    expect(Object.keys(stageColors)).toEqual([
      'G1',
      'G2',
      'G3a',
      'G3b',
      'G4',
      'G5',
    ]);
  });
});

describe('readableTextColor', () => {
  it('returns dark text on a light background', () => {
    expect(readableTextColor('#FFFFFF')).toBe(colors.text.primary);
    expect(readableTextColor('#F1F4F8')).toBe(colors.text.primary);
  });

  it('returns white text on a dark background', () => {
    expect(readableTextColor('#1B2B4B')).toBe(colors.text.onPrimary);
    expect(readableTextColor('#000000')).toBe(colors.text.onPrimary);
  });
});
