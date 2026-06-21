import {Platform} from 'react-native';
import type {TextStyle, ViewStyle} from 'react-native';

/**
 * Single source of truth for design tokens. Every screen/component imports from
 * here so colours, spacing, and type scale cannot drift apart (previously each
 * file redefined its own `COLORS`, with the same token name mapping to different
 * values).
 */

export const colors = {
  primary: '#1B2B4B', // deep navy
  primaryDark: '#2A3F6C',
  primaryTint: '#E8ECF4', // light navy wash (cards/segments)
  accent: '#4A90E2',
  background: '#F8F9FD',
  surface: '#FFFFFF',
  inputBg: '#EEF1F8', // navy-tinted input fill (was an off-palette flat grey)
  border: '#E2E8F0',
  divider: '#E2E8F0',
  danger: '#D7263D', // accessible error red (AA on white)
  success: '#34C759',
  warning: '#FF9500',
  formula: '#F1F5F9',
  link: '#0B5FB0',
  text: {
    primary: '#1A1A1A',
    secondary: '#5B6472', // darkened from #6B7280 for AA body contrast on white
    placeholder: '#8A94A6',
    onPrimary: '#FFFFFF',
  },
  // CKD heat-map hues (KDIGO/JSN convention). Badge text colour is chosen at
  // runtime via readableTextColor() so contrast passes regardless of hue.
  ckdStages: {
    G1: '#4CAF50',
    G2: '#8BC34A',
    G3a: '#FFC107',
    G3b: '#FF9800',
    G4: '#FF5722',
    G5: '#F44336',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
} as const;

export const typography = {
  h1: {fontSize: 28, lineHeight: 34, fontWeight: '700'},
  h2: {fontSize: 20, lineHeight: 26, fontWeight: '700'},
  body: {fontSize: 16, lineHeight: 22, fontWeight: '400'},
  label: {fontSize: 15, lineHeight: 20, fontWeight: '600'},
  caption: {fontSize: 13, lineHeight: 18, fontWeight: '400'},
} satisfies Record<string, TextStyle>;

/** Card elevation shared by every surface card (dedupes the repeated block). */
export const cardShadow: ViewStyle = Platform.select({
  ios: {
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  android: {elevation: 4},
  default: {},
});

/**
 * Pick a foreground colour (near-black or white) that meets WCAG contrast
 * against the given background. Uses relative luminance with the W3C ~0.179
 * threshold so light heat-map hues (yellow/green) get dark text instead of the
 * previously unreadable white.
 */
export function readableTextColor(hex: string): string {
  const c = hex.replace('#', '');
  const toLin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const r = toLin(parseInt(c.slice(0, 2), 16));
  const g = toLin(parseInt(c.slice(2, 4), 16));
  const b = toLin(parseInt(c.slice(4, 6), 16));
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.179 ? colors.text.primary : colors.text.onPrimary;
}
