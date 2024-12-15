import {StyleSheet} from 'react-native';

// Color palette
const COLORS = {
  primary: '#1B2B4B', // Deep navy
  primaryLight: '#2A3F6C',
  secondary: '#E8ECF4',
  accent: '#4A90E2',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  background: '#F8F9FD',
  white: '#FFFFFF',
  text: {
    primary: '#1A1A1A',
    secondary: '#6B7280',
    light: '#94A3B8',
  },
  border: '#E2E8F0',
};

// Typography
const TYPOGRAPHY = {
  h1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
  },
  h2: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
  },
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputSection: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 17,
    color: COLORS.text.primary,
    height: 52,
  },
  unit: {
    position: 'absolute',
    right: 16,
    top: 47,
    color: COLORS.text.secondary,
    fontSize: 15,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 4,
    height: 48,
  },
  segmentButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentButtonActive: {
    backgroundColor: COLORS.primary,
  },
  segmentButtonText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  segmentButtonTextActive: {
    color: COLORS.white,
  },
  calculationButtons: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  actionButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  actionButtonTertiary: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  actionButtonTextSecondary: {
    color: COLORS.primary,
  },
  resultsContainer: {
    marginTop: 32,
    marginBottom: 24,
  },
  resultsSectionTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.primary,
    marginBottom: 20,
  },
  resultCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  activeResultCard: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
  },
  resultUnit: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginLeft: 4,
  },
  stageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  stageBadgeText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  bsaContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  bsaText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  bsaSubtext: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  disclaimer: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
    marginTop: 24,
  },
});
