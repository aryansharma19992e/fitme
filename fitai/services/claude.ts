// ALL AI calls live here — never import AI SDKs in components or pages

import Groq from 'groq-sdk';
import type {
  UserProfile, MealPlan, Meal, WorkoutPlan,
  Language, GenerateMealPlanRequest, GenerateWorkoutRequest,
  ChatRequest, FoodScanRequest,
} from '@/types';
import { calculateBMR, calculateTDEE, calculateMacros } from '@/lib/calculations';
import { filterByDiet } from '@/lib/indianFoods';

const MODEL = 'llama-3.3-70b-versatile';

function getClient(): Groq {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('GROQ_API_KEY not configured — add it to .env.local');
  return new Groq({ apiKey: key });
}

function langInstruction(lang: Language): string {
  if (lang === 'hi')    return 'Respond entirely in Hindi (Devanagari script).';
  if (lang === 'hi-en') return 'Respond in Hinglish — mix Hindi and English naturally.';
  return 'Respond in English.';
}

async function ask(system: string, user: string, maxTokens = 3000): Promise<string> {
  const client = getClient();
  const res = await client.chat.completions.create({
    model: MODEL,
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: system },
      { role: 'user',   content: user },
    ],
  });
  return res.choices[0]?.message?.content?.trim() ?? '';
}

// ─── Meal Plan ────────────────────────────────────────────────────────────────

export async function generateMealPlan(
  req: GenerateMealPlanRequest,
  profile: UserProfile
): Promise<Omit<MealPlan, 'id' | 'createdAt' | 'userId' | 'date' | 'aiGenerated'>> {
  const lang = profile.preferredLanguage ?? 'en';
  const bmr    = calculateBMR(profile.weightKg ?? 70, profile.heightCm ?? 170, profile.age ?? 25, profile.gender === 'female' ? 'female' : 'male');
  const tdee   = profile.tdee ?? calculateTDEE(bmr, profile.activityLevel ?? 'moderate');
  const macros = calculateMacros(tdee, profile.fitnessGoal ?? 'maintain');
  const budget = profile.dailyFoodBudget ?? 200;

  const eligibleFoods = filterByDiet(profile.dietPreference ?? 'veg');
  const foodList = eligibleFoods.map(f =>
    `${f.id}|${f.name}|${f.nameHindi}|${f.caloriesPer100g}kcal|P:${f.proteinG}g|C:${f.carbsG}g|F:${f.fatG}g|serving:${f.typicalServingG}g|cost:₹${f.costPerServingInr}`
  ).join('\n');

  const system = `You are a professional Indian dietitian AI. You ONLY respond with valid JSON, no markdown, no explanation.`;

  const user = `Generate a daily meal plan for ${req.date}.

USER PROFILE:
- Goal: ${profile.fitnessGoal ?? 'maintain'}
- Calorie target: ${macros.calories} kcal
- Macros: protein ${macros.proteinG}g | carbs ${macros.carbsG}g | fat ${macros.fatG}g
- Diet: ${profile.dietPreference ?? 'veg'}
- Budget: ₹${budget}/day
- Language: ${lang}

RULES:
1. Use ONLY foods from the database below (reference by exact id)
2. Total calories within ±50 kcal of ${macros.calories}
3. Total cost ≤ ₹${budget}
4. 5 meals: breakfast, mid_morning_snack, lunch, evening_snack, dinner
5. Each meal: 2-4 food items with gram quantities
6. Balance macros across meals
7. Names and notes in ${lang === 'hi' ? 'Hindi' : lang === 'hi-en' ? 'Hinglish' : 'English'}

FOOD DATABASE (id|name|hindi|cal/100g|macros|serving|cost):
${foodList}

Respond with ONLY this JSON structure:
{
  "meals": [
    {
      "id": "meal-1",
      "type": "breakfast",
      "name": "Morning Meal",
      "time": "08:00",
      "items": [
        { "foodItemId": "idli", "foodName": "Idli", "foodNameHindi": "इडली", "quantityG": 160, "calories": 186, "proteinG": 6.2, "carbsG": 38.1, "fatG": 0.8 }
      ],
      "totalCalories": 186,
      "totalProteinG": 6.2,
      "totalCarbsG": 38.1,
      "totalFatG": 0.8,
      "costInr": 30,
      "notes": "Light start"
    }
  ],
  "totalCalories": ${macros.calories},
  "totalCostInr": ${budget},
  "motivationalNote": "Short tip in ${lang} language"
}`;

  const text = await ask(system, user, 3000);

  // Strip markdown code fences if model adds them
  const clean = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  const parsed = JSON.parse(clean);
  const meals: Meal[] = parsed.meals;

  return {
    meals,
    targetCalories:  macros.calories,
    targetProteinG:  macros.proteinG,
    targetCarbsG:    macros.carbsG,
    targetFatG:      macros.fatG,
    totalCalories:   meals.reduce((s, m) => s + m.totalCalories, 0),
    totalCostInr:    parsed.totalCostInr,
    aiNotes:         parsed.motivationalNote,
    motivationalNote: parsed.motivationalNote,
  };
}

// ─── Food Swap ────────────────────────────────────────────────────────────────

export async function swapFoodItem(
  foodId: string,
  reason: string,
  profile: UserProfile
): Promise<{ foodItemId: string; foodName: string; foodNameHindi: string; quantityG: number; calories: number; proteinG: number; carbsG: number; fatG: number; notes: string }> {
  const eligibleFoods = filterByDiet(profile.dietPreference ?? 'veg');
  const foodList = eligibleFoods.filter(f => f.id !== foodId).map(f => `${f.id}|${f.name}|${f.nameHindi}`).join('\n');

  const text = await ask(
    'You are FitAI. Respond ONLY with valid JSON, no markdown.',
    `Swap food id="${foodId}" because: "${reason}". Diet: ${profile.dietPreference ?? 'veg'}.
Available foods:\n${foodList}
Return ONE replacement: {"foodItemId":"","foodName":"","foodNameHindi":"","quantityG":100,"calories":0,"proteinG":0,"carbsG":0,"fatG":0,"notes":""}`,
    300
  );
  const clean = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(clean);
}

// ─── Workout Plan ─────────────────────────────────────────────────────────────

export async function generateWorkoutPlan(
  req: GenerateWorkoutRequest,
  profile: UserProfile
): Promise<Pick<WorkoutPlan, 'days' | 'aiNotes'>> {
  const lang = profile.preferredLanguage ?? 'en';

  const text = await ask(
    `You are FitAI, an Indian fitness coach. ${langInstruction(lang as Language)} Respond ONLY with valid JSON, no markdown.`,
    `Create a 7-day workout plan starting ${req.weekStartDate}.
User: goal=${profile.fitnessGoal ?? 'maintain'}, level=${profile.workoutLevel ?? 'beginner'}, gym=${profile.gymAccess ?? 'home'}.
Return JSON: { "days": [{ "id":"day-1","dayOfWeek":1,"label":"Push Day","isRestDay":false,"estimatedDurationMinutes":45,"exercises":[{"exerciseId":"push-up","exerciseName":"Push-up","sets":[{"setNumber":1,"reps":12,"restSeconds":60}]}] }], "aiNotes":"tip" }`,
    2500
  );
  const clean = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  const parsed = JSON.parse(clean);
  return { days: parsed.days, aiNotes: parsed.aiNotes };
}

// ─── AI Chat ──────────────────────────────────────────────────────────────────

export async function chatWithCoach(req: ChatRequest, profile: UserProfile): Promise<string> {
  const lang = req.language ?? profile.preferredLanguage ?? 'en';
  const client = getClient();

  const messages: Groq.Chat.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `You are FitAI — an expert Indian fitness and nutrition coach. ${langInstruction(lang as Language)}
You know Indian food deeply: dal, roti, rice, sabzi, regional dishes, street food.
Give practical, motivating advice. Keep responses under 150 words.
User: goal=${profile.fitnessGoal}, diet=${profile.dietPreference}, level=${profile.workoutLevel}, tdee=${profile.tdee ?? 'unknown'} kcal.`,
    },
    ...(req.conversationHistory ?? []).map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user', content: req.message },
  ];

  const res = await client.chat.completions.create({ model: MODEL, max_tokens: 500, messages });
  return res.choices[0]?.message?.content?.trim() ?? '';
}

// ─── Food Scan ────────────────────────────────────────────────────────────────

export interface FoodScanResult {
  detectedItems: Array<{ name: string; estimatedWeightG: number; calories: number; proteinG: number; carbsG: number; fatG: number }>;
  totalCalories: number;
  notes: string;
}

// Groq vision is not yet supported — return a placeholder
export async function scanFood(_req: FoodScanRequest, _lang: Language = 'en'): Promise<FoodScanResult> {
  return {
    detectedItems: [],
    totalCalories: 0,
    notes: 'Food scanning requires a vision model. Coming soon.',
  };
}
