// App-wide constants — plan limits, goals, activity levels, languages

export const APP_NAME = 'FitAI';
export const APP_TAGLINE = 'Your AI fitness coach — knows Indian food, speaks Hindi';

// Subscription plan IDs — must match Razorpay plan IDs and DB enum
export const PLAN_IDS = {
  FREE: 'free',
  PRO_MONTHLY: 'pro_monthly',
  PRO_ANNUAL: 'pro_annual',
} as const;

// Feature limits per plan
export const PLAN_LIMITS = {
  free: {
    aiChatsPerDay: 5,
    mealPlansPerWeek: 1,
    workoutPlansPerWeek: 1,
    foodScansPerDay: 3,
    weightLogsEnabled: true,
    progressChartsEnabled: false,
  },
  pro_monthly: {
    aiChatsPerDay: Infinity,
    mealPlansPerWeek: Infinity,
    workoutPlansPerWeek: Infinity,
    foodScansPerDay: Infinity,
    weightLogsEnabled: true,
    progressChartsEnabled: true,
  },
  pro_annual: {
    aiChatsPerDay: Infinity,
    mealPlansPerWeek: Infinity,
    workoutPlansPerWeek: Infinity,
    foodScansPerDay: Infinity,
    weightLogsEnabled: true,
    progressChartsEnabled: true,
  },
} as const;

// Pricing in INR (paise for Razorpay)
export const PLAN_PRICES_INR = {
  pro_monthly: 299,
  pro_annual: 1999,
} as const;

export const FITNESS_GOALS = [
  { value: 'lose_weight',     label: 'Lose Weight',       labelHi: 'वजन कम करना' },
  { value: 'gain_muscle',     label: 'Build Muscle',      labelHi: 'मांसपेशी बनाना' },
  { value: 'maintain',        label: 'Maintain Weight',   labelHi: 'वजन बनाए रखना' },
  { value: 'recomp',          label: 'Recomposition',     labelHi: 'रिकम्पोजिशन' },
  { value: 'stay_fit',        label: 'Stay Fit',          labelHi: 'फिट रहना' },
  { value: 'improve_stamina', label: 'Improve Stamina',   labelHi: 'सहनशक्ति बढ़ाना' },
] as const;

export const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary (desk job, no exercise)', labelHi: 'बैठे रहना (व्यायाम नहीं)' },
  { value: 'light', label: 'Light (1–2 days/week)', labelHi: 'हल्का (1-2 दिन/सप्ताह)' },
  { value: 'moderate', label: 'Moderate (3–4 days/week)', labelHi: 'मध्यम (3-4 दिन/सप्ताह)' },
  { value: 'active', label: 'Active (5–6 days/week)', labelHi: 'सक्रिय (5-6 दिन/सप्ताह)' },
  { value: 'very_active', label: 'Very Active (athlete/physical job)', labelHi: 'बहुत सक्रिय (एथलीट)' },
] as const;

export const DIET_PREFERENCES = [
  { value: 'veg',        label: 'Vegetarian',     labelHi: 'शाकाहारी' },
  { value: 'nonveg',     label: 'Non-Vegetarian', labelHi: 'मांसाहारी' },
  { value: 'eggetarian', label: 'Eggetarian',     labelHi: 'एगेटेरियन' },
  { value: 'jain',       label: 'Jain',           labelHi: 'जैन' },
  { value: 'vegan',      label: 'Vegan',          labelHi: 'वीगन' },
] as const;

export const GYM_ACCESS_OPTIONS = [
  { value: 'gym',  label: 'Gym Access',    desc: 'Full gym with equipment', emoji: '🏋️' },
  { value: 'home', label: 'Home Workout',  desc: 'Dumbbells / resistance bands', emoji: '🏠' },
  { value: 'none', label: 'No Equipment',  desc: 'Bodyweight only', emoji: '🧘' },
] as const;

export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी' },
  { value: 'hi-en', label: 'Hinglish' },
] as const;

export const WORKOUT_LEVELS = [
  { value: 'beginner', label: 'Beginner (< 6 months)', labelHi: 'शुरुआती' },
  { value: 'intermediate', label: 'Intermediate (6 mo – 2 yr)', labelHi: 'मध्यम' },
  { value: 'advanced', label: 'Advanced (2+ years)', labelHi: 'उन्नत' },
] as const;
