// ALL Claude AI calls live here — never import Anthropic in components or pages

import Anthropic from '@anthropic-ai/sdk';
import type {
  UserProfile,
  MealPlan,
  Meal,
  WorkoutPlan,
  Language,
  GenerateMealPlanRequest,
  GenerateWorkoutRequest,
  ChatRequest,
  FoodScanRequest,
} from '@/types';
import { calculateBMR, calculateTDEE, calculateMacros } from '@/lib/calculations';
import { filterByDiet } from '@/lib/indianFoods';

function getClient(): Anthropic {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || key === 'paste_your_anthropic_key_here') throw new Error('ANTHROPIC_API_KEY not configured');
  return new Anthropic({ apiKey: key });
}

const MODEL = 'claude-sonnet-4-6';

function langInstruction(lang: Language): string {
  if (lang === 'hi')    return 'Respond entirely in Hindi (Devanagari script).';
  if (lang === 'hi-en') return 'Respond in Hinglish — mix Hindi and English naturally.';
  return 'Respond in English.';
}

// ─── Meal Plan Generation ─────────────────────────────────────────────────────

export async function generateMealPlan(
  req: GenerateMealPlanRequest,
  profile: UserProfile
): Promise<Omit<MealPlan, 'id' | 'createdAt' | 'userId' | 'date' | 'aiGenerated'>> {
  const client = getClient();
  const lang = profile.preferredLanguage ?? 'en';

  const bmr    = calculateBMR(profile.weightKg ?? 70, profile.heightCm ?? 170, profile.age ?? 25, profile.gender === 'female' ? 'female' : 'male');
  const tdee   = profile.tdee ?? calculateTDEE(bmr, profile.activityLevel ?? 'moderate');
  const macros = calculateMacros(tdee, profile.fitnessGoal ?? 'maintain');
  const budget = profile.dailyFoodBudget ?? 200;

  const eligibleFoods = filterByDiet(profile.dietPreference ?? 'veg');
  const foodList = eligibleFoods.map(f =>
    `${f.id}|${f.name}|${f.nameHindi}|${f.caloriesPer100g}kcal|P:${f.proteinG}g|C:${f.carbsG}g|F:${f.fatG}g|serving:${f.typicalServingG}g|cost:₹${f.costPerServingInr}`
  ).join('\n');

  const prompt = `You are a professional Indian dietitian AI. Generate a daily meal plan for ${req.date}.

USER PROFILE:
- Goal: ${profile.fitnessGoal ?? 'maintain'}
- Daily calorie target: ${macros.calories} kcal
- Daily macros: protein ${macros.proteinG}g | carbs ${macros.carbsG}g | fat ${macros.fatG}g
- Diet type: ${profile.dietPreference ?? 'veg'}
- Daily food budget: ₹${budget}
- Language: ${lang}

RULES:
1. Use ONLY foods from the list below — reference foods by their exact id
2. Total calories must be within ±50 kcal of ${macros.calories}
3. Total cost must be ≤ ₹${budget}
4. 5 meals: breakfast, mid_morning_snack, lunch, evening_snack, dinner
5. Each meal: 2–4 food items with specific gram quantities
6. Balance macros — don't pile all protein in one meal
7. Meal names and notes in ${lang === 'hi' ? 'Hindi' : lang === 'hi-en' ? 'Hinglish' : 'English'}

FOOD DATABASE (id|name|hindi|cal/100g|macros|serving|cost):
${foodList}

Respond with ONLY valid JSON (no markdown, no explanation):
{
  "meals": [
    {
      "id": "meal-1",
      "type": "breakfast",
      "name": "Morning Meal",
      "time": "08:00",
      "items": [
        {
          "foodItemId": "idli",
          "foodName": "Idli",
          "foodNameHindi": "इडली",
          "quantityG": 160,
          "calories": 186,
          "proteinG": 6.2,
          "carbsG": 38.1,
          "fatG": 0.8,
          "notes": "4 pieces with sambar"
        }
      ],
      "totalCalories": 186,
      "totalProteinG": 6.2,
      "totalCarbsG": 38.1,
      "totalFatG": 0.8,
      "costInr": 30,
      "notes": "Light and energising start"
    }
  ],
  "totalCalories": ${macros.calories},
  "totalCostInr": ${budget},
  "motivationalNote": "Short motivating tip in ${lang} language"
}`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const parsed = JSON.parse(text.trim());

  const meals: Meal[] = parsed.meals;
  const totalCalories: number = meals.reduce((s, m) => s + m.totalCalories, 0);

  return {
    meals,
    targetCalories: macros.calories,
    targetProteinG: macros.proteinG,
    targetCarbsG:   macros.carbsG,
    targetFatG:     macros.fatG,
    totalCalories,
    totalCostInr:   parsed.totalCostInr,
    aiNotes:        parsed.motivationalNote,
    motivationalNote: parsed.motivationalNote,
  };
}

// ─── Food Swap ────────────────────────────────────────────────────────────────

export async function swapFoodItem(
  foodId: string,
  reason: string,
  profile: UserProfile
): Promise<{ foodItemId: string; foodName: string; foodNameHindi: string; quantityG: number; calories: number; proteinG: number; carbsG: number; fatG: number; notes: string }> {
  const client = getClient();
  const lang = profile.preferredLanguage ?? 'en';
  const eligibleFoods = filterByDiet(profile.dietPreference ?? 'veg');
  const foodList = eligibleFoods
    .filter(f => f.id !== foodId)
    .map(f => `${f.id}|${f.name}|${f.nameHindi}`)
    .join('\n');

  const prompt = `User wants to swap food item id="${foodId}" because: "${reason}".
Diet type: ${profile.dietPreference ?? 'veg'}. ${langInstruction(lang as Language)}

Available replacement foods:
${foodList}

Return ONLY valid JSON with a single replacement item:
{"foodItemId":"id","foodName":"name","foodNameHindi":"hindi","quantityG":100,"calories":0,"proteinG":0,"carbsG":0,"fatG":0,"notes":"reason for suggestion"}`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
  return JSON.parse(text.trim());
}

// ─── Workout Plan ─────────────────────────────────────────────────────────────

export async function generateWorkoutPlan(
  req: GenerateWorkoutRequest,
  profile: UserProfile
): Promise<Pick<WorkoutPlan, 'days' | 'aiNotes'>> {
  const client = getClient();
  const lang = profile.preferredLanguage ?? 'en';

  const prompt = `You are FitAI, an Indian fitness coach. ${langInstruction(lang as Language)}

Create a 7-day workout plan starting ${req.weekStartDate}.
User: goal=${profile.fitnessGoal ?? 'maintain'}, level=${profile.workoutLevel ?? 'beginner'}, gym=${profile.gymAccess ?? 'home'}.

Return ONLY valid JSON:
{
  "days": [
    {
      "id": "day-1",
      "dayOfWeek": 1,
      "label": "Push Day",
      "isRestDay": false,
      "estimatedDurationMinutes": 45,
      "exercises": [
        {
          "exerciseId": "push-up",
          "exerciseName": "Push-up",
          "sets": [
            { "setNumber": 1, "reps": 12, "restSeconds": 60 },
            { "setNumber": 2, "reps": 12, "restSeconds": 60 },
            { "setNumber": 3, "reps": 10, "restSeconds": 60 }
          ]
        }
      ]
    }
  ],
  "aiNotes": "Short motivational note"
}`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2500,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const parsed = JSON.parse(text.trim());
  return { days: parsed.days, aiNotes: parsed.aiNotes };
}

// ─── AI Chat ──────────────────────────────────────────────────────────────────

export async function chatWithCoach(req: ChatRequest, profile: UserProfile): Promise<string> {
  const client = getClient();
  const lang = req.language ?? profile.preferredLanguage ?? 'en';

  const systemPrompt = `You are FitAI — an expert Indian fitness and nutrition coach.
${langInstruction(lang as Language)}
You know Indian food deeply: dal, roti, rice, sabzi, regional dishes, street food.
Give practical, motivating advice. Keep responses under 150 words.
User: goal=${profile.fitnessGoal}, diet=${profile.dietPreference}, level=${profile.workoutLevel}, tdee=${profile.tdee ?? 'unknown'} kcal.`;

  const history = (req.conversationHistory ?? []).map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 500,
    system: systemPrompt,
    messages: [...history, { role: 'user', content: req.message }],
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}

// ─── Food Scan (Vision) ───────────────────────────────────────────────────────

export interface FoodScanResult {
  detectedItems: Array<{ name: string; estimatedWeightG: number; calories: number; proteinG: number; carbsG: number; fatG: number }>;
  totalCalories: number;
  notes: string;
}

export async function scanFood(req: FoodScanRequest, lang: Language = 'en'): Promise<FoodScanResult> {
  const client = getClient();

  const prompt = `You are FitAI. Analyze this food image. ${langInstruction(lang)}
Return ONLY valid JSON:
{
  "detectedItems": [
    { "name": "Roti", "estimatedWeightG": 40, "calories": 96, "proteinG": 3.4, "carbsG": 17.3, "fatG": 1.5 }
  ],
  "totalCalories": 96,
  "notes": "Brief note about the meal"
}`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 800,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: req.mimeType, data: req.imageBase64 } },
        { type: 'text', text: prompt },
      ],
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
  return JSON.parse(text.trim());
}
