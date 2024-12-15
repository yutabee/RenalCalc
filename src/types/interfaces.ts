export interface CKDStage {
  stage: string;
  description: string;
  color: string;
}

export interface ResultCardProps {
  title: string;
  value: number;
  unit: string;
  stage?: CKDStage;
  description?: string;
  isActive?: boolean;
}

export interface InputValidation {
  ageNum: number;
  weightNum: number;
  heightNum: number;
  serumCr: number;
}

export interface ActionButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  backgroundColor?: string;
}
