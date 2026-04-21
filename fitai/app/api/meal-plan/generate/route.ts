import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateMealPlan } from '@/services/claude';
import type { UserProfile, MealPlan, Subscription } from '@/types';

const FREE_PLAN_MONTHLY_LIMIT = 3;

function makeUserClient(token: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });

  try {
    const auth = req.headers.get('authorization') ?? '';
    const token = auth.replace('Bearer ', '').trim();
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Verify token and get user
    const sb = makeUserClient(token);
    const { data: { user }, error: authErr } = await sb.auth.getUser();
    if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const date: string = body.date ?? new Date().toISOString().split('T')[0];

    // Load profile
    const { data: profileRow, error: profileErr } = await sb.from('profiles').select('*').eq('id', user.id).single();
    if (profileErr || !profileRow) return NextResponse.json({ error: 'Profile not found — complete onboarding first' }, { status: 404 });

    const profile: UserProfile = {
      id: profileRow.id,
      email: profileRow.email,
      fullName: profileRow.full_name,
      age: profileRow.age,
      gender: profileRow.gender,
      heightCm: profileRow.height_cm,
      weightKg: profileRow.weight_kg,
      goalWeightKg: profileRow.goal_weight_kg,
      activityLevel: profileRow.activity_level,
      fitnessGoal: profileRow.fitness_goal,
      dietPreference: profileRow.diet_preference,
      workoutLevel: profileRow.workout_level,
      preferredLanguage: profileRow.preferred_language ?? 'en',
      gymAccess: profileRow.gym_access,
      tdee: profileRow.tdee,
      dailyFoodBudget: profileRow.daily_food_budget,
      onboardingComplete: profileRow.onboarding_complete ?? false,
      createdAt: profileRow.created_at,
      updatedAt: profileRow.updated_at,
    };

    // Return cached plan if one already exists for today
    const { data: existing } = await sb.from('meal_plans').select('*').eq('user_id', user.id).eq('date', date).order('created_at', { ascending: false }).limit(1).maybeSingle();
    if (existing) {
      return NextResponse.json({ data: rowToMealPlan(existing), cached: true });
    }

    // Rate limiting for free users
    const { data: subRow } = await sb.from('subscriptions').select('*').eq('user_id', user.id).maybeSingle();
    const sub = subRow as Subscription | null;
    const isPro = sub?.status === 'active' && sub?.planId !== 'free';
    if (!isPro) {
      const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
      const { count } = await sb.from('meal_plans').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('ai_generated', true).gte('created_at', monthStart.toISOString());
      if ((count ?? 0) >= FREE_PLAN_MONTHLY_LIMIT) {
        return NextResponse.json({ error: `Free plan allows ${FREE_PLAN_MONTHLY_LIMIT} AI meal plans per month. Upgrade to Pro for unlimited.` }, { status: 429 });
      }
    }

    // Generate with Claude
    const generated = await generateMealPlan({ userId: user.id, date }, profile);

    // Save to DB
    const { data: saved, error: saveErr } = await sb.from('meal_plans').insert({
      user_id: user.id,
      date,
      meals: generated.meals,
      target_calories: generated.targetCalories,
      target_protein_g: generated.targetProteinG,
      target_carbs_g: generated.targetCarbsG,
      target_fat_g: generated.targetFatG,
      total_calories: generated.totalCalories,
      ai_generated: true,
      ai_notes: generated.aiNotes,
    }).select().single();

    if (saveErr) throw new Error(saveErr.message);

    return NextResponse.json({ data: rowToMealPlan(saved) });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    console.error('[meal-plan/generate]', msg);
    if (msg.includes('ANTHROPIC_API_KEY')) {
      return NextResponse.json({ error: 'AI not configured — add ANTHROPIC_API_KEY to .env.local' }, { status: 503 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function rowToMealPlan(row: Record<string, unknown>): MealPlan {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    date: row.date as string,
    meals: row.meals as MealPlan['meals'],
    targetCalories: row.target_calories as number,
    targetProteinG: row.target_protein_g as number,
    targetCarbsG: row.target_carbs_g as number,
    targetFatG: row.target_fat_g as number,
    totalCalories: row.total_calories as number,
    aiGenerated: row.ai_generated as boolean,
    aiNotes: row.ai_notes as string,
    createdAt: row.created_at as string,
  };
}
