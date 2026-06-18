/**
 * Renal-function reference calculations.
 *
 * These are educational reference equations, not a medical device. All
 * functions are pure and return raw (unrounded) values; rounding for display
 * happens at the call site. Reference values are locked by the acceptance
 * tests in `__tests__/calculations.test.ts`.
 *
 * Sources:
 * - eGFR: Japanese Society of Nephrology (JSN) CKD Guideline 2018
 *   https://cdn.jsn.or.jp/data/CKD2018.pdf
 * - CCr:  Cockcroft DW, Gault MH. Nephron. 1976;16(1):31-41
 *   https://pubmed.ncbi.nlm.nih.gov/1244564/
 * - BSA:  藤本ら. 日本衛生学雑誌 1968;23(5):443-450
 *   https://cir.nii.ac.jp/crid/1390001206358904064
 */

export type Sex = 'male' | 'female';

export interface RawInputs {
  age: string;
  weight: string;
  height: string;
  serumCreatinine: string;
  sex: Sex;
}

export interface RenalInputs {
  age: number;
  weight: number;
  height: number;
  serumCreatinine: number;
  sex: Sex;
}

export interface CKDStageInfo {
  stage: 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5';
  description: string;
}

/**
 * Estimated glomerular filtration rate (eGFR) using the JSN equation.
 *
 * `eGFR = 194 × SCr^-1.094 × age^-0.287`, multiplied by `0.739` for female.
 * Intended for adults; not valid in acute kidney injury or for non-steady-state
 * creatinine.
 *
 * @param serumCreatinine Serum creatinine in mg/dL.
 * @param age Age in years.
 * @param sex Biological sex (applies the 0.739 female coefficient).
 * @returns eGFR in mL/min/1.73m² (raw, unrounded).
 */
export function calculateEGFR(
  serumCreatinine: number,
  age: number,
  sex: Sex,
): number {
  const base = 194 * Math.pow(serumCreatinine, -1.094) * Math.pow(age, -0.287);
  return sex === 'female' ? base * 0.739 : base;
}

/**
 * Creatinine clearance (CCr) using the Cockcroft–Gault formula.
 *
 * `CCr = ((140 − age) × weight) / (72 × SCr)`, multiplied by `0.85` for female.
 * Uses actual body weight, so it can overestimate in obese or edematous
 * patients; commonly used for drug-dose adjustment.
 *
 * @param age Age in years.
 * @param weight Body weight in kg.
 * @param serumCreatinine Serum creatinine in mg/dL.
 * @param sex Biological sex (applies the 0.85 female coefficient).
 * @returns CCr in mL/min (raw, unrounded).
 */
export function calculateCCr(
  age: number,
  weight: number,
  serumCreatinine: number,
  sex: Sex,
): number {
  const base = ((140 - age) * weight) / (72 * serumCreatinine);
  return sex === 'female' ? base * 0.85 : base;
}

/**
 * Body surface area (BSA) using the Fujimoto equation (derived for Japanese
 * body types).
 *
 * `BSA = 0.008883 × weight^0.444 × height^0.663`.
 *
 * @param heightCm Height in cm.
 * @param weightKg Body weight in kg.
 * @returns BSA in m² (raw, unrounded).
 */
export function calculateBSA(heightCm: number, weightKg: number): number {
  return 0.008883 * Math.pow(weightKg, 0.444) * Math.pow(heightCm, 0.663);
}

/**
 * Map an eGFR value to its CKD stage (G1–G5) per the KDIGO/JSN classification.
 * Boundaries (mL/min/1.73m²): G1 ≥90, G2 60–89, G3a 45–59, G3b 30–44,
 * G4 15–29, G5 <15. Returns the stage code and a Japanese description; UI
 * colour mapping is the caller's concern.
 *
 * @param egfr eGFR in mL/min/1.73m².
 */
export function getCKDStage(egfr: number): CKDStageInfo {
  if (egfr >= 90) {
    return {stage: 'G1', description: '正常または高値'};
  }
  if (egfr >= 60) {
    return {stage: 'G2', description: '軽度低下'};
  }
  if (egfr >= 45) {
    return {stage: 'G3a', description: '軽度～中等度低下'};
  }
  if (egfr >= 30) {
    return {stage: 'G3b', description: '中等度～高度低下'};
  }
  if (egfr >= 15) {
    return {stage: 'G4', description: '高度低下'};
  }
  return {stage: 'G5', description: '末期腎不全'};
}

/**
 * Parse and validate the raw string inputs from the form. Uses `Number()` (not
 * `parseFloat`) so trailing garbage like `"12abc"` is rejected rather than
 * silently truncated. Throws an `Error` with a user-facing Japanese message on
 * the first empty/non-numeric/out-of-range field. Ranges: age 18–120, weight
 * 30–150 kg, height 120–200 cm, serum creatinine 0.3–15.0 mg/dL.
 *
 * @throws {Error} when a field is empty, non-numeric, or out of range.
 */
export function validateInputs(raw: RawInputs): RenalInputs {
  const trimmedAge = raw.age.trim();
  const trimmedWeight = raw.weight.trim();
  const trimmedHeight = raw.height.trim();
  const trimmedSerumCreatinine = raw.serumCreatinine.trim();

  const age = Number(trimmedAge);
  const weight = Number(trimmedWeight);
  const height = Number(trimmedHeight);
  const serumCreatinine = Number(trimmedSerumCreatinine);

  if (
    !trimmedAge ||
    !trimmedWeight ||
    !trimmedHeight ||
    !trimmedSerumCreatinine ||
    !Number.isFinite(age) ||
    !Number.isFinite(weight) ||
    !Number.isFinite(height) ||
    !Number.isFinite(serumCreatinine)
  ) {
    throw new Error('すべての値を入力してください');
  }

  if (age < 18 || age > 120) {
    throw new Error('年齢は18-120の範囲で入力してください');
  }

  if (weight < 30 || weight > 150) {
    throw new Error('体重は30-150kgの範囲で入力してください');
  }

  if (height < 120 || height > 200) {
    throw new Error('身長は120-200cmの範囲で入力してください');
  }

  if (serumCreatinine < 0.3 || serumCreatinine > 15) {
    throw new Error('血清クレアチニンは0.3-15.0 mg/dLの範囲で入力してください');
  }

  return {age, weight, height, serumCreatinine, sex: raw.sex};
}
