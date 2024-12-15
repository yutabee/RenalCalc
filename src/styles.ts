// src/styles.ts
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  subtitle: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  inputSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 17,
    color: '#1A1A1A',
    height: 48,
  },
  unit: {
    position: 'absolute',
    right: 16,
    top: 45,
    color: '#666666',
    fontSize: 15,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
    height: 40,
  },
  segmentButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentButtonActive: {
    backgroundColor: '#2D6A4F',
  },
  segmentButtonText: {
    fontSize: 15,
    color: '#666666',
    fontWeight: '600',
  },
  segmentButtonTextActive: {
    color: '#FFFFFF',
  },
  calculationButtons: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  footerButtons: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  footerButtonsDivider: {
    height: 8,
  },
  footerButtonsRow: {
    flexDirection: 'row',
    // React Native 0.71以降でgapがサポートされる場合はそのまま使用可能。
    // それ以前のバージョンではgapはサポート外のため、スペース用のViewかmarginで対応する必要がある。
    // gap: 12,
  },
  actionButton: {
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2D6A4F',
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  actionButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2D6A4F',
  },
  actionButtonTertiary: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.24,
  },
  actionButtonTextSecondary: {
    color: '#2D6A4F',
  },
  actionButtonTextTertiary: {
    color: '#2D6A4F',
  },
  resultsContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  resultsSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  activeResultCard: {
    borderWidth: 2,
    borderColor: '#2D6A4F',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  resultValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D6A4F',
  },
  resultUnit: {
    fontSize: 15,
    color: '#666666',
  },
  stageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  stageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  stageBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  stageDescription: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
  },
  resultDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
  bsaContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  bsaText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2D6A4F',
  },
  bsaSubtext: {
    fontSize: 13,
    color: '#666666',
    marginTop: 4,
  },
  formulaSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  formulaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F0F7F4',
  },
  formulaHeaderText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2D6A4F',
  },
  formulaHeaderIcon: {
    fontSize: 16,
    color: '#2D6A4F',
  },
  formulaContent: {
    padding: 16,
  },
  formulaTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 12,
    marginBottom: 8,
  },
  formulaDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 16,
  },
  privacyContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  privacyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  privacyParagraph: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333333',
    marginBottom: 16,
  },
});
