/*
 * ============================================================
 * SQL SCHEMA — run this in Supabase SQL Editor (Dashboard > SQL)
 * ============================================================
 *
 * -- Enable UUID extension (already enabled in new Supabase projects)
 * create extension if not exists "uuid-ossp";
 *
 * -- PROFILES
 * create table if not exists profiles (
 *   id              uuid primary key references auth.users(id) on delete cascade,
 *   email           text,
 *   phone           text,
 *   full_name       text,
 *   avatar_url      text,
 *   age             int,
 *   gender          text check (gender in ('male','female','other')),
 *   height_cm       numeric,
 *   weight_kg       numeric,
 *   goal_weight_kg  numeric,
 *   activity_level  text check (activity_level in ('sedentary','light','moderate','active','very_active')),
 *   fitness_goal    text check (fitness_goal in ('lose_weight','maintain','gain_muscle','recomp')),
 *   diet_preference text check (diet_preference in ('veg','nonveg','eggetarian','jain')),
 *   workout_level   text check (workout_level in ('beginner','intermediate','advanced')),
 *   preferred_language text check (preferred_language in ('en','hi','hi-en')) default 'en',
 *   onboarding_complete boolean default false,
 *   created_at      timestamptz default now(),
 *   updated_at      timestamptz default now()
 * );
 * alter table profiles enable row level security;
 * create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
 * create policy "Users can upsert own profile" on profiles for insert with check (auth.uid() = id);
 * create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
 *
 * -- MEAL PLANS
 * create table if not exists meal_plans (
 *   id              uuid primary key default uuid_generate_v4(),
 *   user_id         uuid references profiles(id) on delete cascade not null,
 *   date            date not null,
 *   meals           jsonb not null default '[]',
 *   target_calories numeric,
 *   target_protein_g numeric,
 *   target_carbs_g  numeric,
 *   target_fat_g    numeric,
 *   total_calories  numeric,
 *   ai_generated    boolean default false,
 *   ai_notes        text,
 *   created_at      timestamptz default now()
 * );
 * alter table meal_plans enable row level security;
 * create policy "Users can manage own meal plans" on meal_plans using (auth.uid() = user_id);
 * create index on meal_plans(user_id, date);
 *
 * -- WORKOUT PLANS
 * create table if not exists workout_plans (
 *   id              uuid primary key default uuid_generate_v4(),
 *   user_id         uuid references profiles(id) on delete cascade not null,
 *   week_start_date date not null,
 *   days            jsonb not null default '[]',
 *   goal            text,
 *   level           text,
 *   ai_generated    boolean default false,
 *   ai_notes        text,
 *   created_at      timestamptz default now()
 * );
 * alter table workout_plans enable row level security;
 * create policy "Users can manage own workout plans" on workout_plans using (auth.uid() = user_id);
 * create index on workout_plans(user_id, week_start_date);
 *
 * -- FOOD LOGS
 * create table if not exists food_logs (
 *   id              uuid primary key default uuid_generate_v4(),
 *   user_id         uuid references profiles(id) on delete cascade not null,
 *   date            date not null,
 *   meal_type       text check (meal_type in ('breakfast','lunch','dinner','snack')) not null,
 *   food_item_id    text,
 *   food_name       text not null,
 *   quantity_g      numeric not null,
 *   calories        numeric not null,
 *   protein_g       numeric not null,
 *   carbs_g         numeric not null,
 *   fat_g           numeric not null,
 *   image_url       text,
 *   logged_at       timestamptz default now()
 * );
 * alter table food_logs enable row level security;
 * create policy "Users can manage own food logs" on food_logs using (auth.uid() = user_id);
 * create index on food_logs(user_id, date);
 *
 * -- WEIGHT LOGS
 * create table if not exists weight_logs (
 *   id              uuid primary key default uuid_generate_v4(),
 *   user_id         uuid references profiles(id) on delete cascade not null,
 *   date            date not null,
 *   weight_kg       numeric not null,
 *   notes           text,
 *   logged_at       timestamptz default now()
 * );
 * alter table weight_logs enable row level security;
 * create policy "Users can manage own weight logs" on weight_logs using (auth.uid() = user_id);
 * create index on weight_logs(user_id, date);
 *
 * -- SUBSCRIPTIONS
 * create table if not exists subscriptions (
 *   id                       uuid primary key default uuid_generate_v4(),
 *   user_id                  uuid references profiles(id) on delete cascade not null unique,
 *   plan_id                  text check (plan_id in ('free','pro_monthly','pro_annual')) default 'free',
 *   status                   text check (status in ('active','cancelled','expired','trial')) default 'active',
 *   razorpay_subscription_id text,
 *   razorpay_customer_id     text,
 *   current_period_start     timestamptz,
 *   current_period_end       timestamptz,
 *   cancelled_at             timestamptz,
 *   created_at               timestamptz default now()
 * );
 * alter table subscriptions enable row level security;
 * create policy "Users can read own subscription" on subscriptions for select using (auth.uid() = user_id);
 * -- Service role (webhook) manages writes; not exposed to client RLS.
 *
 * -- AI CHAT LOGS
 * create table if not exists ai_chat_logs (
 *   id          uuid primary key default uuid_generate_v4(),
 *   user_id     uuid references profiles(id) on delete cascade not null,
 *   role        text check (role in ('user','assistant')) not null,
 *   content     text not null,
 *   language    text check (language in ('en','hi','hi-en')) default 'en',
 *   created_at  timestamptz default now()
 * );
 * alter table ai_chat_logs enable row level security;
 * create policy "Users can manage own chat" on ai_chat_logs using (auth.uid() = user_id);
 * create index on ai_chat_logs(user_id, created_at desc);
 * ============================================================
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type {
  UserProfile,
  MealPlan,
  WorkoutPlan,
  FoodLog,
  WeightLog,
  Subscription,
  ChatMessage,
} from '@/types';

// ─── Client ──────────────────────────────────────────────────────────────────

function getSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  return createClient(url, key);
}

export const supabase = getSupabaseClient();

// Service-role client — only used in API routes (server-side), never in components
export function getServiceSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toProfile(row: Record<string, unknown>): UserProfile {
  return {
    id: row.id as string,
    email: row.email as string | undefined,
    phone: row.phone as string | undefined,
    fullName: row.full_name as string | undefined,
    avatarUrl: row.avatar_url as string | undefined,
    age: row.age as number | undefined,
    gender: row.gender as UserProfile['gender'],
    heightCm: row.height_cm as number | undefined,
    weightKg: row.weight_kg as number | undefined,
    goalWeightKg: row.goal_weight_kg as number | undefined,
    activityLevel: row.activity_level as UserProfile['activityLevel'],
    fitnessGoal: row.fitness_goal as UserProfile['fitnessGoal'],
    dietPreference: row.diet_preference as UserProfile['dietPreference'],
    workoutLevel: row.workout_level as UserProfile['workoutLevel'],
    preferredLanguage: (row.preferred_language as UserProfile['preferredLanguage']) ?? 'en',
    gymAccess: row.gym_access as UserProfile['gymAccess'],
    tdee: row.tdee as number | undefined,
    dailyFoodBudget: row.daily_food_budget as number | undefined,
    onboardingComplete: (row.onboarding_complete as boolean) ?? false,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return toProfile(data);
}

export async function upsertProfile(profile: Partial<UserProfile> & { id: string }): Promise<UserProfile> {
  const row = {
    id: profile.id,
    email: profile.email,
    phone: profile.phone,
    full_name: profile.fullName,
    avatar_url: profile.avatarUrl,
    age: profile.age,
    gender: profile.gender,
    height_cm: profile.heightCm,
    weight_kg: profile.weightKg,
    goal_weight_kg: profile.goalWeightKg,
    activity_level: profile.activityLevel,
    fitness_goal: profile.fitnessGoal,
    diet_preference: profile.dietPreference,
    workout_level: profile.workoutLevel,
    preferred_language: profile.preferredLanguage,
    gym_access: profile.gymAccess,
    tdee: profile.tdee,
    daily_food_budget: profile.dailyFoodBudget,
    onboarding_complete: profile.onboardingComplete,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('profiles')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return toProfile(data);
}

// ─── Meal Plans ───────────────────────────────────────────────────────────────

export async function saveMealPlan(plan: Omit<MealPlan, 'id' | 'createdAt'>): Promise<MealPlan> {
  const { data, error } = await supabase
    .from('meal_plans')
    .insert({
      user_id: plan.userId,
      date: plan.date,
      meals: plan.meals,
      target_calories: plan.targetCalories,
      target_protein_g: plan.targetProteinG,
      target_carbs_g: plan.targetCarbsG,
      target_fat_g: plan.targetFatG,
      total_calories: plan.totalCalories,
      ai_generated: plan.aiGenerated,
      ai_notes: plan.aiNotes,
    })
    .select()
    .single();
  if (error) throw error;
  return { ...plan, id: data.id, createdAt: data.created_at };
}

export async function getTodayMealPlan(userId: string): Promise<MealPlan | null> {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('meal_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id,
    userId: data.user_id,
    date: data.date,
    meals: data.meals,
    targetCalories: data.target_calories,
    targetProteinG: data.target_protein_g,
    targetCarbsG: data.target_carbs_g,
    targetFatG: data.target_fat_g,
    totalCalories: data.total_calories,
    aiGenerated: data.ai_generated,
    aiNotes: data.ai_notes,
    createdAt: data.created_at,
  };
}

// ─── Food Logs ────────────────────────────────────────────────────────────────

export async function logFood(entry: Omit<FoodLog, 'id' | 'loggedAt'>): Promise<FoodLog> {
  const { data, error } = await supabase
    .from('food_logs')
    .insert({
      user_id: entry.userId,
      date: entry.date,
      meal_type: entry.mealType,
      food_item_id: entry.foodItemId,
      food_name: entry.foodName,
      quantity_g: entry.quantityG,
      calories: entry.calories,
      protein_g: entry.proteinG,
      carbs_g: entry.carbsG,
      fat_g: entry.fatG,
      image_url: entry.imageUrl,
    })
    .select()
    .single();
  if (error) throw error;
  return { ...entry, id: data.id, loggedAt: data.logged_at };
}

// ─── Workout Plans ────────────────────────────────────────────────────────────

export async function saveWorkoutPlan(plan: Omit<WorkoutPlan, 'id' | 'createdAt'>): Promise<WorkoutPlan> {
  const { data, error } = await supabase
    .from('workout_plans')
    .insert({
      user_id: plan.userId,
      week_start_date: plan.weekStartDate,
      days: plan.days,
      goal: plan.goal,
      level: plan.level,
      ai_generated: plan.aiGenerated,
      ai_notes: plan.aiNotes,
    })
    .select()
    .single();
  if (error) throw error;
  return { ...plan, id: data.id, createdAt: data.created_at };
}

export async function getWeekWorkoutPlan(userId: string): Promise<WorkoutPlan | null> {
  // Get the start of the current week (Monday)
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff)).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('workout_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('week_start_date', monday)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id,
    userId: data.user_id,
    weekStartDate: data.week_start_date,
    days: data.days,
    goal: data.goal,
    level: data.level,
    aiGenerated: data.ai_generated,
    aiNotes: data.ai_notes,
    createdAt: data.created_at,
  };
}

// ─── Weight Logs ──────────────────────────────────────────────────────────────

export async function logWeight(entry: Omit<WeightLog, 'id' | 'loggedAt'>): Promise<WeightLog> {
  const { data, error } = await supabase
    .from('weight_logs')
    .insert({
      user_id: entry.userId,
      date: entry.date,
      weight_kg: entry.weightKg,
      notes: entry.notes,
    })
    .select()
    .single();
  if (error) throw error;
  return { ...entry, id: data.id, loggedAt: data.logged_at };
}

export async function getWeightHistory(userId: string, days = 30): Promise<WeightLog[]> {
  const from = new Date();
  from.setDate(from.getDate() - days);

  const { data, error } = await supabase
    .from('weight_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('date', from.toISOString().split('T')[0])
    .order('date', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    date: row.date,
    weightKg: row.weight_kg,
    notes: row.notes,
    loggedAt: row.logged_at,
  }));
}

// ─── Meal Plan Rate Limiting ──────────────────────────────────────────────────

export async function getMealPlanCountThisMonth(userId: string): Promise<number> {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from('meal_plans')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('ai_generated', true)
    .gte('created_at', monthStart.toISOString());
  if (error) throw error;
  return count ?? 0;
}

export async function getFoodLogsToday(userId: string): Promise<import('@/types').FoodLog[]> {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('food_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .order('logged_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(row => ({
    id: row.id,
    userId: row.user_id,
    date: row.date,
    mealType: row.meal_type,
    foodItemId: row.food_item_id,
    foodName: row.food_name,
    quantityG: row.quantity_g,
    calories: row.calories,
    proteinG: row.protein_g,
    carbsG: row.carbs_g,
    fatG: row.fat_g,
    imageUrl: row.image_url,
    loggedAt: row.logged_at,
  }));
}

// ─── Subscriptions ────────────────────────────────────────────────────────────

export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id,
    userId: data.user_id,
    planId: data.plan_id,
    status: data.status,
    razorpaySubscriptionId: data.razorpay_subscription_id,
    razorpayCustomerId: data.razorpay_customer_id,
    currentPeriodStart: data.current_period_start,
    currentPeriodEnd: data.current_period_end,
    cancelledAt: data.cancelled_at,
    createdAt: data.created_at,
  };
}

// ─── AI Chat Logs ─────────────────────────────────────────────────────────────

export async function saveChatMessage(message: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from('ai_chat_logs')
    .insert({
      user_id: message.userId,
      role: message.role,
      content: message.content,
      language: message.language,
    })
    .select()
    .single();
  if (error) throw error;
  return { ...message, id: data.id, createdAt: data.created_at };
}

export async function getChatHistory(userId: string, limit = 50): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('ai_chat_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    role: row.role,
    content: row.content,
    language: row.language,
    createdAt: row.created_at,
  }));
}
