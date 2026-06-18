/**
 * Acceptance tests for renal calculation logic.
 * Reference values are computed independently (see commit message) and locked here
 * to guard the medical formulas against regressions.
 */
import {
  calculateEGFR,
  calculateCCr,
  calculateBSA,
  getCKDStage,
  validateInputs,
} from '../calculations';

describe('calculateEGFR (JSN equation)', () => {
  it('computes male eGFR (Cr=1.0, age=50)', () => {
    expect(calculateEGFR(1.0, 50, 'male')).toBeCloseTo(63.1244, 2);
  });

  it('applies the 0.739 female coefficient', () => {
    expect(calculateEGFR(1.0, 50, 'female')).toBeCloseTo(46.6489, 2);
    expect(calculateEGFR(1.0, 50, 'female')).toBeCloseTo(
      calculateEGFR(1.0, 50, 'male') * 0.739,
      6,
    );
  });

  it('computes a reduced-function case (Cr=2.0, age=70, male)', () => {
    expect(calculateEGFR(2.0, 70, 'male')).toBeCloseTo(26.8492, 2);
  });

  it('returns a raw (unrounded) value', () => {
    // not pre-rounded to 1 decimal
    expect(calculateEGFR(1.0, 50, 'male')).not.toBe(63.1);
  });
});

describe('calculateCCr (Cockcroft-Gault)', () => {
  it('computes male CCr (age=50, weight=60, Cr=1.0)', () => {
    expect(calculateCCr(50, 60, 1.0, 'male')).toBeCloseTo(75.0, 4);
  });

  it('applies the 0.85 female coefficient', () => {
    expect(calculateCCr(50, 60, 1.0, 'female')).toBeCloseTo(63.75, 4);
  });
});

describe('calculateBSA (Fujimoto)', () => {
  it('computes BSA (height=170, weight=60)', () => {
    expect(calculateBSA(170, 60)).toBeCloseTo(1.6476, 3);
  });
});

describe('getCKDStage (boundaries)', () => {
  const cases: Array<[number, string]> = [
    [120, 'G1'],
    [90, 'G1'],
    [89.9, 'G2'],
    [60, 'G2'],
    [59.9, 'G3a'],
    [45, 'G3a'],
    [44.9, 'G3b'],
    [30, 'G3b'],
    [29.9, 'G4'],
    [15, 'G4'],
    [14.9, 'G5'],
    [5, 'G5'],
  ];
  it.each(cases)('eGFR %p -> stage %p', (egfr, stage) => {
    expect(getCKDStage(egfr).stage).toBe(stage);
  });

  it('returns a description and no UI color field', () => {
    const result = getCKDStage(95);
    expect(result.description).toBe('正常または高値');
    expect((result as Record<string, unknown>).color).toBeUndefined();
  });
});

describe('validateInputs', () => {
  const valid = {
    age: '50',
    weight: '60',
    height: '170',
    serumCreatinine: '1.0',
    sex: 'male' as const,
  };

  it('parses valid string inputs into numbers', () => {
    expect(validateInputs(valid)).toEqual({
      age: 50,
      weight: 60,
      height: 170,
      serumCreatinine: 1.0,
      sex: 'male',
    });
  });

  it('throws when a field is empty', () => {
    expect(() => validateInputs({...valid, age: ''})).toThrow(
      'すべての値を入力してください',
    );
  });

  it('rejects non-numeric input (no silent parseFloat truncation)', () => {
    expect(() => validateInputs({...valid, age: '12abc'})).toThrow();
  });

  it('enforces the age range', () => {
    expect(() => validateInputs({...valid, age: '17'})).toThrow(
      '年齢は18-120の範囲で入力してください',
    );
    expect(() => validateInputs({...valid, age: '121'})).toThrow(
      '年齢は18-120の範囲で入力してください',
    );
  });

  it('enforces the weight range', () => {
    expect(() => validateInputs({...valid, weight: '29'})).toThrow(
      '体重は30-150kgの範囲で入力してください',
    );
  });

  it('enforces the height range', () => {
    expect(() => validateInputs({...valid, height: '119'})).toThrow(
      '身長は120-200cmの範囲で入力してください',
    );
  });

  it('enforces the serum creatinine range', () => {
    expect(() => validateInputs({...valid, serumCreatinine: '0.2'})).toThrow(
      '血清クレアチニンは0.3-15.0 mg/dLの範囲で入力してください',
    );
    expect(() => validateInputs({...valid, serumCreatinine: '15.1'})).toThrow(
      '血清クレアチニンは0.3-15.0 mg/dLの範囲で入力してください',
    );
  });
});
