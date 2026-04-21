'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { getTodayMealPlan } from '@/services/supabase';
import { useRouter } from 'next/navigation';
import type { MealPlan } from '@/types';

// ─── Calorie ring SVG ─────────────────────────────────────────────────────────

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
        <text x="70" y="65" textAnchor="middle" className="text-2xl font-black" style={{ fontSize: 26, fontWeight: 900, fill: '#111827' }}>
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
        <span className="text-gray-400">{current}g</span>
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
  const target = 8;
  return (
    <div className="bg-white rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">💧</span>
          <span className="font-semibold text-gray-800 text-sm">Water</span>
        </div>
        <span className="text-xs text-gray-400">{glasses}/{target} glasses</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: target }).map((_, i) => (
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

function MealCard({ name, calories, items }: { name: string; calories: number; items: string[] }) {
  const MEAL_EMOJI: Record<string, string> = { Breakfast: '🌅', Lunch: '☀️', Dinner: '🌙', Snack: '🍎' };
  return (
    <div className="bg-white rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{MEAL_EMOJI[name] ?? '🍽️'}</span>
          <span className="font-semibold text-gray-800">{name}</span>
        </div>
        <span className="text-sm font-bold text-green-600">{calories} kcal</span>
      </div>
      {items.length > 0 ? (
        <ul className="space-y-1">
          {items.map((item, i) => (
            <li key={i} className="text-sm text-gray-500 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400">No items logged yet</p>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NutritionPage() {
  const { user, profile, signOut } = useUser();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.replace('/');
  }
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getTodayMealPlan(user.id)
      .then(setPlan)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
  const firstName = profile?.fullName?.split(' ')[0] ?? 'there';
  const targetCal = plan?.targetCalories ?? profile?.tdee ?? 2000;
  const consumed = plan?.totalCalories ?? 0;
  const targetP = plan?.targetProteinG ?? 120;
  const targetC = plan?.targetCarbsG ?? 250;
  const targetF = plan?.targetFatG ?? 55;

  return (
    <div className="min-h-screen" style={{ background: '#0d1f12' }}>
      {/* Dark green header */}
      <div className="px-5 pt-12 pb-24" style={{ background: '#0d1f12' }}>
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold" style={{ color: '#4ade80' }}>{today}</p>
          <button
            onClick={handleSignOut}
            className="text-xs font-medium px-3 py-1 rounded-full transition-colors"
            style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            Sign out
          </button>
        </div>
        <h1 className="text-2xl font-black text-white">Hey, {firstName} 👋</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>Here's your nutrition for today</p>
      </div>

      {/* White card overlapping header */}
      <div className="mx-4 -mt-16 rounded-3xl bg-white shadow-xl p-5 space-y-5">
        {/* Calorie ring + macros */}
        <div className="flex items-center gap-4">
          <CalorieRing consumed={consumed} target={targetCal} />
          <div className="flex flex-col gap-3 flex-1">
            <MacroBar label="Protein" current={0} target={targetP} color="#3b82f6" />
            <MacroBar label="Carbs"   current={0} target={targetC} color="#f59e0b" />
            <MacroBar label="Fat"     current={0} target={targetF} color="#ef4444" />
          </div>
        </div>

        {/* Water */}
        <WaterTracker />

        {/* Meals */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-7 h-7 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : plan ? (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-gray-700">Today's meals</h2>
            {plan.meals.map(meal => (
              <MealCard
                key={meal.id}
                name={meal.name}
                calories={meal.totalCalories}
                items={meal.items.map(i => `${i.foodName} — ${i.quantityG}g`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-3xl mb-3">🍽️</p>
            <p className="text-gray-600 font-semibold mb-1">No meal plan yet</p>
            <p className="text-sm text-gray-400 mb-4">Generate a personalised AI meal plan for today</p>
            <button
              className="px-6 py-3 rounded-2xl font-bold text-white text-sm active:scale-95 transition-all"
              style={{ background: '#16a34a' }}
              onClick={() => {/* TODO: call /api/meal-plan/generate */}}
            >
              Generate Meal Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
