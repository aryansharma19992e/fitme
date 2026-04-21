// ALL app-wide TypeScript types
// RULE: NO framework imports (no Next.js, no Supabase, no React) — React Native can import this file directly

// ─── Auth / User ─────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;                        // matches Supabase auth.users.id (UUID)
  email?: string;
  phone?: string;
  fullName?: string;
  avatarUrl?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  heightCm?: number;
  weightKg?: number;
  goalWeightKg?: number;
  activityLevel?: ActivityLevel;
  fitnessGoal?: FitnessGoal;
  dietPreference?: DietPreference;
  workoutLevel?: WorkoutLevel;
  preferredLanguage?: Language;
  gymAccess?: GymAccess;
  tdee?: number;
  dailyFoodBudget?: number;
  onboardingComplete: boolean;
  createdAt: string;                 // ISO 8601
  updatedAt: string;
}

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type FitnessGoal = 'lose_weight' | 'maintain' | 'gain_muscle' | 'recomp' | 'stay_fit' | 'improve_stamina';
export type DietPreference = 'veg' | 'nonveg' | 'eggetarian' | 'jain' | 'vegan';
export type WorkoutLevel = 'beginner' | 'intermediate' | 'advanced';
export type Language = 'en' | 'hi' | 'hi-en';
export type GymAccess = 'gym' | 'home' | 'none';

// ─── Nutrition ────────────────────────────────────────────────────────────────

export interface FoodItem {
  id: string;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g: number;
  servingSizeG: number;
  isVeg: boolean;
  category: FoodCategory;
}

export type FoodCategory = 'grain' | 'legume' | 'vegetable' | 'dairy' | 'meat' | 'snack' | 'sweet' | 'beverage' | 'condiment';

export type MealType = 'breakfast' | 'mid_morning_snack' | 'lunch' | 'evening_snack' | 'dinner';

export interface Meal {
  id: string;
  type?: MealType;
  name: string;
  time?: string;
  items: MealItem[];
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  costInr?: number;
  notes?: string;
}

export interface MealItem {
  foodItemId: string;
  foodName: string;
  foodNameHindi?: string;
  quantityG: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  notes?: string;
}

export interface MealPlan {
  id: string;
  userId: string;
  date: string;                      // YYYY-MM-DD
  meals: Meal[];
  targetCalories: number;
  targetProteinG: number;
  targetCarbsG: number;
  targetFatG: number;
  totalCalories: number;
  totalCostInr?: number;
  aiGenerated: boolean;
  aiNotes?: string;
  motivationalNote?: string;
  createdAt: string;
}

export interface FoodLog {
  id: string;
  userId: string;
  date: string;                      // YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodItemId?: string;
  foodName: string;
  quantityG: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  loggedAt: string;                  // ISO 8601
  imageUrl?: string;                 // from food-scan feature
}

// ─── Workout ──────────────────────────────────────────────────────────────────

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  difficulty: WorkoutLevel;
  instructions?: string;
  videoUrl?: string;
  isBodyweight: boolean;
}

export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'legs' | 'glutes' | 'core' | 'cardio' | 'full_body';
export type Equipment = 'none' | 'dumbbells' | 'barbell' | 'machine' | 'resistance_band' | 'pull_up_bar' | 'bench';

export interface WorkoutSet {
  setNumber: number;
  reps?: number;
  durationSeconds?: number;         // for timed exercises
  weightKg?: number;
  restSeconds: number;
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
  notes?: string;
}

export interface WorkoutDay {
  id: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;  // 0 = Sunday
  label: string;                     // e.g. "Push Day", "Rest", "Leg Day"
  isRestDay: boolean;
  exercises: WorkoutExercise[];
  estimatedDurationMinutes?: number;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  weekStartDate: string;             // YYYY-MM-DD (Monday)
  days: WorkoutDay[];
  goal: FitnessGoal;
  level: WorkoutLevel;
  aiGenerated: boolean;
  aiNotes?: string;
  createdAt: string;
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  setsCompleted: WorkoutSet[];
}

export interface WorkoutLog {
  id: string;
  userId: string;
  workoutPlanId?: string;
  workoutDayId?: string;
  date: string;                      // YYYY-MM-DD
  exercises: ExerciseLog[];
  durationMinutes: number;
  notes?: string;
  loggedAt: string;
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export interface WeightLog {
  id: string;
  userId: string;
  date: string;                      // YYYY-MM-DD
  weightKg: number;
  notes?: string;
  loggedAt: string;
}

// ─── Subscriptions ────────────────────────────────────────────────────────────

export type PlanId = 'free' | 'pro_monthly' | 'pro_annual';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'trial';

export interface SubscriptionPlan {
  id: PlanId;
  name: string;
  priceINR: number;
  billingPeriod: 'monthly' | 'annual' | 'free';
  aiChatsPerDay: number | null;      // null = unlimited
  mealPlansPerWeek: number | null;
  workoutPlansPerWeek: number | null;
  foodScansPerDay: number | null;
  progressChartsEnabled: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: PlanId;
  status: SubscriptionStatus;
  razorpaySubscriptionId?: string;
  razorpayCustomerId?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelledAt?: string;
  createdAt: string;
}

// ─── AI Chat ─────────────────────────────────────────────────────────────────

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  userId: string;
  role: ChatRole;
  content: string;
  language: Language;
  createdAt: string;
}

// ─── API Payloads (shared between Next.js and React Native) ──────────────────

export interface GenerateMealPlanRequest {
  userId: string;
  date: string;
  targetCalories?: number;
  preferences?: Partial<Pick<UserProfile, 'dietPreference' | 'fitnessGoal' | 'preferredLanguage'>>;
}

export interface GenerateWorkoutRequest {
  userId: string;
  weekStartDate: string;
  preferences?: Partial<Pick<UserProfile, 'fitnessGoal' | 'workoutLevel' | 'activityLevel'>>;
}

export interface ChatRequest {
  userId: string;
  message: string;
  language?: Language;
  conversationHistory?: Pick<ChatMessage, 'role' | 'content'>[];
}

export interface FoodScanRequest {
  userId: string;
  imageBase64: string;
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  offline?: boolean;
}
