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

export function calculateEGFR(
  serumCreatinine: number,
  age: number,
  sex: Sex,
): number {
  const base =
    194 * Math.pow(serumCreatinine, -1.094) * Math.pow(age, -0.287);
  return sex === 'female' ? base * 0.739 : base;
}

export function calculateCCr(
  age: number,
  weight: number,
  serumCreatinine: number,
  sex: Sex,
): number {
  const base = ((140 - age) * weight) / (72 * serumCreatinine);
  return sex === 'female' ? base * 0.85 : base;
}

export function calculateBSA(heightCm: number, weightKg: number): number {
  return 0.008883 * Math.pow(weightKg, 0.444) * Math.pow(heightCm, 0.663);
}

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
    throw new Error(
      '血清クレアチニンは0.3-15.0 mg/dLの範囲で入力してください',
    );
  }

  return {age, weight, height, serumCreatinine, sex: raw.sex};
}
