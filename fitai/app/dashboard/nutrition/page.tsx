'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/hooks/useUser';
import { getTodayMealPlan, logFood, getFoodLogsToday } from '@/services/supabase';
import { useRouter } from 'next/navigation';
import type { MealPlan, Meal, FoodLog } from '@/types';

// ─── Calorie ring ─────────────────────────────────────────────────────────────

function CalorieRing({ consumed, target }: { consumed: number; target: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(consumed / Math.max(target, 1), 1);
  const dash = pct * circ;
  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#f3f4f6" strokeWidth="12" />
        <circle
          cx="70" cy="70" r={r} fill="none"
          stroke="#16a34a" strokeWidth="12"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
        <text x="70" y="65" textAnchor="middle" style={{ fontSize: 26, fontWeight: 900, fill: '#111827' }}>
          {consumed}
        </text>
        <text x="70" y="84" textAnchor="middle" style={{ fontSize: 11, fill: '#9ca3af' }}>
          of {target} kcal
        </text>
      </svg>
      <p className="text-xs font-medium text-gray-400 -mt-2">{Math.max(0, target - consumed)} kcal remaining</p>
    </div>
  );
}

// ─── Macro bar ────────────────────────────────────────────────────────────────

function MacroBar({ label, current, target, color }: { label: string; current: number; target: number; color: string }) {
  const pct = Math.min((current / Math.max(target, 1)) * 100, 100);
  return (
    <div className="flex-1">
      <div className="flex justify-between text-xs mb-1">
        <span className="font-semibold text-gray-700">{label}</span>
        <span className="text-gray-400">{Math.round(current)}g</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <p className="text-xs text-gray-400 mt-0.5">{target}g goal</p>
    </div>
  );
}

// ─── Water tracker ────────────────────────────────────────────────────────────

function WaterTracker() {
  const [glasses, setGlasses] = useState(0);
  return (
    <div className="bg-white rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">💧</span>
          <span className="font-semibold text-gray-800 text-sm">Water</span>
        </div>
        <span className="text-xs text-gray-400">{glasses}/8 glasses</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setGlasses(i < glasses ? i : i + 1)}
            className="flex-1 h-7 rounded-lg transition-all"
            style={{ background: i < glasses ? '#bfdbfe' : '#f3f4f6' }}
            aria-label={`Glass ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Meal card ────────────────────────────────────────────────────────────────

const MEAL_EMOJI: Record<string, string> = {
  Breakfast: '🌅', breakfast: '🌅',
  Lunch: '☀️', lunch: '☀️',
  Dinner: '🌙', dinner: '🌙',
  Snack: '🍎', snack: '🍎',
  mid_morning_snack: '🍎', evening_snack: '🍎',
};

function MealCard({ meal, eaten, onEat }: { meal: Meal; eaten: boolean; onEat: () => void }) {
  return (
    <div className={`bg-white rounded-2xl p-4 transition-all ${eaten ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{MEAL_EMOJI[meal.name] ?? MEAL_EMOJI[meal.type ?? ''] ?? '🍽️'}</span>
          <div>
            <span className="font-semibold text-gray-800 text-sm">{meal.name}</span>
            {meal.notes && <p className="text-xs text-gray-400 mt-0.5">{meal.notes}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {meal.costInr && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#f0fdf4', color: '#15803d' }}>
              ₹{meal.costInr}
            </span>
          )}
          <span className="text-sm font-bold text-green-600">{meal.totalCalories} kcal</span>
        </div>
      </div>

      <ul className="space-y-1 mb-3">
        {meal.items.map((item, i) => (
          <li key={i} className="text-sm text-gray-500 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
              {item.foodName}{item.foodNameHindi ? ` (${item.foodNameHindi})` : ''} — {item.quantityG}g
            </span>
            <span className="text-xs text-gray-400 flex-shrink-0">{item.calories} kcal</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <span className="text-xs text-gray-400">
          P: {meal.totalProteinG}g · C: {meal.totalCarbsG}g · F: {meal.totalFatG}g
        </span>
        <button
          onClick={onEat}
          disabled={eaten}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all active:scale-95"
          style={{
            background: eaten ? '#f3f4f6' : '#f0fdf4',
            color: eaten ? '#9ca3af' : '#16a34a',
          }}
        >
          {eaten ? '✓ Logged' : '✓ I ate this'}
        </button>
      </div>
    </div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
          <div className="flex justify-between mb-3">
            <div className="h-4 w-24 bg-gray-100 rounded" />
            <div className="h-4 w-16 bg-gray-100 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-100 rounded" />
            <div className="h-3 w-3/4 bg-gray-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NutritionPage() {
  const { user, profile, session, signOut } = useUser();
  const router = useRouter();

  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [eatenMealIds, setEatenMealIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const [mealPlan, logs] = await Promise.all([
        getTodayMealPlan(user.id),
        getFoodLogsToday(user.id),
      ]);
      setPlan(mealPlan);
      setFoodLogs(logs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleGenerate() {
    if (!session?.access_token) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/meal-plan/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ date: new Date().toISOString().split('T')[0] }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Generation failed');
      setPlan(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setGenerating(false);
    }
  }

  async function handleEatMeal(meal: Meal) {
    if (!user || eatenMealIds.has(meal.id)) return;
    setEatenMealIds(prev => new Set(prev).add(meal.id));
    const today = new Date().toISOString().split('T')[0];
    try {
      await Promise.all(
        meal.items.map(item =>
          logFood({
            userId: user.id,
            date: today,
            mealType: (meal.type ?? 'snack') as FoodLog['mealType'],
            foodItemId: item.foodItemId,
            foodName: item.foodName,
            quantityG: item.quantityG,
            calories: item.calories,
            proteinG: item.proteinG,
            carbsG: item.carbsG,
            fatG: item.fatG,
          })
        )
      );
      const logs = await getFoodLogsToday(user.id);
      setFoodLogs(logs);
    } catch (e) {
      console.error('Failed to log meal', e);
      setEatenMealIds(prev => { const s = new Set(prev); s.delete(meal.id); return s; });
    }
  }

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
  const firstName = profile?.fullName?.split(' ')[0] ?? 'there';
  const targetCal = plan?.targetCalories ?? profile?.tdee ?? 2000;
  const targetP = plan?.targetProteinG ?? Math.round((targetCal * 0.3) / 4);
  const targetC = plan?.targetCarbsG ?? Math.round((targetCal * 0.45) / 4);
  const targetF = plan?.targetFatG ?? Math.round((targetCal * 0.25) / 9);

  const consumedCal = foodLogs.reduce((s, l) => s + l.calories, 0);
  const consumedP   = foodLogs.reduce((s, l) => s + l.proteinG, 0);
  const consumedC   = foodLogs.reduce((s, l) => s + l.carbsG, 0);
  const consumedF   = foodLogs.reduce((s, l) => s + l.fatG, 0);

  return (
    <div className="min-h-screen" style={{ background: '#0d1f12' }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-24" style={{ background: '#0d1f12' }}>
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold" style={{ color: '#4ade80' }}>{today}</p>
          <button
            onClick={async () => { await signOut(); router.replace('/'); }}
            className="text-xs font-medium px-3 py-1 rounded-full transition-colors"
            style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            Sign out
          </button>
        </div>
        <h1 className="text-2xl font-black text-white">Hey, {firstName} 👋</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>Here's your nutrition for today</p>
      </div>

      {/* Main card */}
      <div className="mx-4 -mt-16 rounded-3xl bg-white shadow-xl p-5 space-y-5 pb-28">
        {/* Calorie ring + macros */}
        <div className="flex items-center gap-4">
          <CalorieRing consumed={Math.round(consumedCal)} target={targetCal} />
          <div className="flex flex-col gap-3 flex-1">
            <MacroBar label="Protein" current={consumedP} target={targetP} color="#3b82f6" />
            <MacroBar label="Carbs"   current={consumedC} target={targetC} color="#f59e0b" />
            <MacroBar label="Fat"     current={consumedF} target={targetF} color="#ef4444" />
          </div>
        </div>

        {/* Water */}
        <WaterTracker />

        {/* Meals */}
        {loading ? (
          <Skeleton />
        ) : plan ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-700">Today's meals</h2>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all active:scale-95"
                style={{ background: '#f0fdf4', color: '#16a34a' }}
              >
                {generating ? 'Generating…' : '↻ Regenerate'}
              </button>
            </div>
            {error && <p className="text-xs text-red-500 text-center">{error}</p>}
            {plan.meals.map(meal => (
              <MealCard
                key={meal.id}
                meal={meal}
                eaten={eatenMealIds.has(meal.id)}
                onEat={() => handleEatMeal(meal)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-3xl mb-3">🍽️</p>
            <p className="text-gray-600 font-semibold mb-1">No meal plan yet</p>
            <p className="text-sm text-gray-400 mb-4">Generate a personalised AI meal plan for today</p>
            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-6 py-3 rounded-2xl font-bold text-white text-sm active:scale-95 transition-all flex items-center gap-2 mx-auto"
              style={{ background: generating ? '#4ade80' : '#16a34a' }}
            >
              {generating && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {generating ? 'Generating your plan…' : 'Generate Meal Plan'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
