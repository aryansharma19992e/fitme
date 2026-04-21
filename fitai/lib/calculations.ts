// BMR, TDEE, and macro calculations
// Pure math — no framework imports, no side effects

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Goal = 'lose_weight' | 'maintain' | 'gain_muscle' | 'recomp' | 'stay_fit' | 'improve_stamina';
export type Gender = 'male' | 'female';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// Mifflin-St Jeor equation (more accurate than Harris-Benedict for general population)
export function calculateBMR(weightKg: number, heightCm: number, ageYears: number, gender: Gender): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  return gender === 'male' ? base + 5 : base - 161;
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

export interface MacroTargets {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

// Macro splits: [protein%, carbs%, fat%]
const MACRO_SPLITS: Record<Goal, [number, number, number]> = {
  lose_weight:     [0.40, 0.30, 0.30],
  gain_muscle:     [0.30, 0.50, 0.20],
  recomp:          [0.35, 0.40, 0.25],
  maintain:        [0.30, 0.45, 0.25],
  stay_fit:        [0.30, 0.45, 0.25],
  improve_stamina: [0.25, 0.55, 0.20],
};

export function calculateMacros(tdee: number, goal: Goal, _weightKg?: number): MacroTargets {
  let calories: number;

  switch (goal) {
    case 'lose_weight':
      calories = Math.round(tdee * 0.80);
      break;
    case 'gain_muscle':
      calories = Math.round(tdee * 1.10);
      break;
    default:
      calories = tdee;
  }

  const [pPct, cPct, fPct] = MACRO_SPLITS[goal];
  const proteinG = Math.round((calories * pPct) / 4);
  const carbsG   = Math.round((calories * cPct) / 4);
  const fatG     = Math.round((calories * fPct) / 9);

  return { calories, proteinG, carbsG, fatG };
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

export function idealWeightRange(heightCm: number): { minKg: number; maxKg: number } {
  const heightM = heightCm / 100;
  return {
    minKg: Math.round(18.5 * heightM * heightM),
    maxKg: Math.round(24.9 * heightM * heightM),
  };
}
