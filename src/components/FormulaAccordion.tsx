import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Constants
const COLORS = {
  primary: '#1B2B4B',
  primaryLight: '#E8ECF4',
  background: '#FFFFFF',
  text: {
    primary: '#1A1A1A',
    secondary: '#6B7280',
    accent: '#1B2B4B',
  },
  divider: '#E2E8F0',
};

interface FormulaSection {
  title: string;
  content: string[];
}

const FORMULA_SECTIONS: FormulaSection[] = [
  {
    title: '1. eGFR（推算糸球体濾過量）',
    content: [
      '男性：eGFR = 194 × (S-Cr)^(-1.094) × (年齢)^(-0.287)',
      '女性：上式 × 0.739',
      '（単位：mL/min/1.73m²）',
    ],
  },
  {
    title: '2. CCr（クレアチニンクリアランス）',
    content: [
      '男性：CCr = ((140 - 年齢) × 体重) / (72 × S-Cr)',
      '女性：上式 × 0.85',
      '（単位：mL/min）',
    ],
  },
  {
    title: '3. 体表面積（BSA）',
    content: ['BSA = 0.008883 × 体重^(0.444) × 身長^(0.663)', '（単位：m²）'],
  },
  {
    title: '4. CKD重症度分類',
    content: [
      'G1: ≥90 mL/min/1.73m²',
      'G2: 60-89 mL/min/1.73m²',
      'G3a: 45-59 mL/min/1.73m²',
      'G3b: 30-44 mL/min/1.73m²',
      'G4: 15-29 mL/min/1.73m²',
      'G5: ＜15 mL/min/1.73m²',
    ],
  },
  {
    title: '5. 注意事項',
    content: [
      'eGFRやCCrは推定値であり、特殊な病態では精度が低下する場合があります。',
      '診断や治療には、医師など専門家の意見を必ず仰いでください。',
    ],
  },
];

export const FormulaAccordion: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleAccordion = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);

    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isExpanded, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleAccordion}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{expanded: isExpanded}}
        accessibilityHint="タップして計算式の詳細を表示">
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>計算式について</Text>
          <Animated.View
            style={[styles.iconContainer, {transform: [{rotate: spin}]}]}>
            <Text style={styles.icon}>▼</Text>
          </Animated.View>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          {FORMULA_SECTIONS.map((section, index) => (
            <View
              key={section.title}
              style={[
                styles.section,
                index === FORMULA_SECTIONS.length - 1 && styles.lastSection,
              ]}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionContent}>
                {section.content.map((text, i) => (
                  <Text key={i} style={styles.sectionText}>
                    {text}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.primaryLight,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text.accent,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 12,
    color: COLORS.text.accent,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  lastSection: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  sectionContent: {
    gap: 8,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.text.secondary,
  },
});

export default FormulaAccordion;
