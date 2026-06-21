import {Platform} from 'react-native';
import type {TextStyle, ViewStyle} from 'react-native';

/**
 * Single source of truth for design tokens. Every screen/component imports from
 * here so colours, spacing, and type scale cannot drift apart.
 *
 * Design language: "Clinical Calm + Lab Readout" — hierarchy is built from
 * hairline borders, whitespace, and weight rather than uniform drop shadows.
 * Elevation is rationed across three tiers (see cardShadow / raisedShadow) so
 * depth carries meaning: inputs recede into sunken wells, the answer rises.
 */

export const colors = {
  primary: '#1B2B4B', // brand ink — rationed to the result value + primary action
  primaryPressed: '#16233D', // primary button pressed fill
  accent: '#3E5C8A', // muted steel-navy: input focus ring + links (kept OUTSIDE the CKD hue family)
  background: '#FAFBFC', // paper canvas
  surface: '#FFFFFF', // card fill — defined by its hairline, not its shadow
  inputBg: '#F1F4F8', // sunken well fill (inputs, segmented track, formula blocks)
  border: '#DBE0E6', // hairline rules + input rest border (visible at rest)
  divider: '#EAEDF1', // lighter intra-card row separation (distinct from border)
  danger: '#C0233A', // error border + text
  dangerWash: '#FBEEEF', // errored input fill
  success: '#2E8B57', // on-brand green (tokenised for future in-range confirmation)
  formula: '#F1F4F8', // monospace formula block bg (== inputBg)
  link: '#3E5C8A', // reference links (== accent)
  text: {
    primary: '#16213A', // headings + typed values; navy-tinted near-black
    secondary: '#4F5B6B', // workhorse grey: labels, units, descriptions, captions
    tertiary: '#62707F', // eyebrow/overline, legal, disabled text
    placeholder: '#6E7787', // input placeholder — carries the valid-range hint, so AA-bumped (4.1:1 on the sunken fill)
    onPrimary: '#FFFFFF', // text on navy fills
  },
  // CKD heat-map, retuned into one desaturated clinical ramp inside the navy
  // family. Every hue is AA with white text via readableTextColor() (verified
  // 4.68–7.37:1). G3a/G3b sit just under the 0.179 flip on purpose — see the
  // contrast test in theme.test.ts which locks white-text selection.
  ckdStages: {
    G1: '#2F7D54',
    G2: '#5C7A33',
    G3a: '#9A6B12',
    G3b: '#B45A1E',
    G4: '#B04326',
    G5: '#A02834',
  },
} as const;

/** Stage code -> ramp hex, shared by ResultCard badge and the Formulas table rail. */
export const stageColors: Record<
  'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5',
  string
> = {
  G1: colors.ckdStages.G1,
  G2: colors.ckdStages.G2,
  G3a: colors.ckdStages.G3a,
  G3b: colors.ckdStages.G3b,
  G4: colors.ckdStages.G4,
  G5: colors.ckdStages.G5,
};

// Strict 4pt grid. `gutter` = screen horizontal padding, `card` = card interior.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  gutter: 16,
  card: 20,
} as const;

// Document-like radii: 14 reads reference-document; 20 reads consumer-app.
export const radius = {
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
} as const;

// tabular-nums is applied in component StyleSheets (contextual typing) rather
// than baked into these tokens, to keep the token objects plainly typed.
export const typography = {
  eyebrow: {fontSize: 12, lineHeight: 16, fontWeight: '600', letterSpacing: 1},
  h1: {fontSize: 26, lineHeight: 32, fontWeight: '700', letterSpacing: -0.2},
  h2: {fontSize: 19, lineHeight: 25, fontWeight: '700', letterSpacing: -0.1},
  body: {fontSize: 16, lineHeight: 24, fontWeight: '400'},
  label: {fontSize: 14, lineHeight: 18, fontWeight: '600'},
  resultValue: {
    fontSize: 40,
    lineHeight: 46, // >=1.15x so descenders/diacritics don't clip when scaled
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  resultUnit: {fontSize: 15, lineHeight: 20, fontWeight: '500'},
  inputValue: {fontSize: 17, lineHeight: 22, fontWeight: '500'},
  data: {fontSize: 15, lineHeight: 20, fontWeight: '400'}, // inline units + table cells (tabular data)
  caption: {fontSize: 13, lineHeight: 18, fontWeight: '400'},
  legal: {fontSize: 12, lineHeight: 17, fontWeight: '400'},
} satisfies Record<string, TextStyle>;

/** Reusable 1px hairline that carries hierarchy in place of shadows. */
export const hairline: ViewStyle = {
  borderWidth: 1,
  borderColor: colors.border,
};

/** TIER 1 (paper): input card + formula section cards. Barely-there shadow. */
export const cardShadow: ViewStyle = Platform.select({
  ios: {
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  android: {elevation: 1},
  default: {},
});

/** TIER 2 (raised): ResultCard + primary button ONLY — "this is the answer". */
export const raisedShadow: ViewStyle = Platform.select({
  ios: {
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  android: {elevation: 6},
  default: {},
});

/**
 * Pick a foreground colour (near-black or white) that meets WCAG contrast
 * against the given background. Uses relative luminance with the W3C ~0.179
 * threshold. Unchanged — the CKD ramp above is tuned so all six hues resolve to
 * white text and pass AA.
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
