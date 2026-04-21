'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { upsertProfile } from '@/services/supabase';
import { calculateBMR, calculateTDEE } from '@/lib/calculations';
import {
  FITNESS_GOALS, ACTIVITY_LEVELS, DIET_PREFERENCES,
  WORKOUT_LEVELS, LANGUAGES, GYM_ACCESS_OPTIONS,
} from '@/lib/constants';
import type { FitnessGoal, ActivityLevel, DietPreference, WorkoutLevel, Language, GymAccess } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  fullName: string;
  age: string;
  gender: 'male' | 'female' | 'other' | '';
  heightCm: string;
  weightKg: string;
  goalWeightKg: string;
  fitnessGoal: FitnessGoal | '';
  dietPreference: DietPreference | '';
  activityLevel: ActivityLevel | '';
  dailyFoodBudget: number;
  preferredLanguage: Language;
  gymAccess: GymAccess | '';
  workoutLevel: WorkoutLevel | '';
}

const INITIAL: FormData = {
  fullName: '', age: '', gender: '',
  heightCm: '', weightKg: '', goalWeightKg: '',
  fitnessGoal: '', dietPreference: '',
  activityLevel: '', dailyFoodBudget: 200,
  preferredLanguage: 'en', gymAccess: '', workoutLevel: '',
};

const STEP_TITLES = [
  "What's your name?",
  'Body details',
  'Your goal',
  'Diet preference',
  'Activity level',
  'Daily food budget',
  'Preferred language',
  'Gym access',
];

const TOTAL_STEPS = STEP_TITLES.length;

// ─── Sub-components ───────────────────────────────────────────────────────────

function TextInput({ value, onChange, placeholder, type = 'text', suffix }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; suffix?: string;
}) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={type === 'number' ? 'decimal' : undefined}
        className="w-full px-4 py-3.5 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
        style={{ background: '#f3f4f6', border: 'none' }}
      />
      {suffix && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">{suffix}</span>
      )}
    </div>
  );
}

function OptionCard({ label, sublabel, selected, onClick, emoji }: {
  label: string; sublabel?: string; selected: boolean; onClick: () => void; emoji?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-4 py-3.5 rounded-2xl border-2 font-medium text-sm transition-all"
      style={{
        borderColor: selected ? '#16a34a' : '#e5e7eb',
        background: selected ? 'rgba(22,163,74,0.06)' : '#ffffff',
        color: selected ? '#15803d' : '#374151',
      }}
    >
      <div className="flex items-center gap-3">
        {emoji && <span className="text-xl">{emoji}</span>}
        <div>
          <div className="font-semibold">{label}</div>
          {sublabel && <div className="text-xs mt-0.5 font-normal" style={{ color: selected ? '#16a34a' : '#9ca3af' }}>{sublabel}</div>}
        </div>
        {selected && (
          <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#16a34a' }}>
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [form, setForm] = useState<FormData>(INITIAL);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user) {
      const stored = sessionStorage.getItem('fitai_onboarding');
      if (stored) {
        try { setForm(JSON.parse(stored)); } catch {}
        sessionStorage.removeItem('fitai_onboarding');
      }
    }
  }, [user, loading]);

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function canAdvance(): boolean {
    switch (step) {
      case 0: return !!form.fullName.trim();
      case 1: return !!form.age && !!form.gender && !!form.heightCm && !!form.weightKg;
      case 2: return !!form.fitnessGoal;
      case 3: return !!form.dietPreference;
      case 4: return !!form.activityLevel;
      case 5: return true; // budget has default
      case 6: return true; // language has default
      case 7: return !!form.gymAccess && !!form.workoutLevel;
      default: return false;
    }
  }

  function goNext() {
    if (!canAdvance()) return;
    setDirection('forward');
    setStep(s => s + 1);
  }

  function goBack() {
    setDirection('back');
    setStep(s => s - 1);
  }

  async function handleFinish() {
    if (!canAdvance()) return;
    setSaving(true);
    setError('');

    try {
      if (!user) {
        sessionStorage.setItem('fitai_onboarding', JSON.stringify(form));
        router.push('/login?next=/onboarding/complete');
        return;
      }

      const weightKg = parseFloat(form.weightKg);
      const heightCm = parseFloat(form.heightCm);
      const age      = parseInt(form.age);
      const gender   = form.gender === 'other' ? 'male' : (form.gender as 'male' | 'female');

      const bmr  = calculateBMR(weightKg, heightCm, age, gender);
      const tdee = calculateTDEE(bmr, form.activityLevel as ActivityLevel);

      await upsertProfile({
        id: user.id,
        email: user.email,
        fullName: form.fullName.trim(),
        age,
        gender: form.gender || undefined,
        heightCm,
        weightKg,
        goalWeightKg: form.goalWeightKg ? parseFloat(form.goalWeightKg) : undefined,
        fitnessGoal: form.fitnessGoal || undefined,
        activityLevel: form.activityLevel || undefined,
        dietPreference: form.dietPreference || undefined,
        workoutLevel: form.workoutLevel || undefined,
        preferredLanguage: form.preferredLanguage,
        gymAccess: form.gymAccess || undefined,
        tdee,
        dailyFoodBudget: form.dailyFoodBudget,
        onboardingComplete: true,
      });

      router.push('/dashboard/nutrition');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save. Try again.');
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const GOAL_META: Record<string, { emoji: string; sublabel: string }> = {
    lose_weight:     { emoji: '🔥', sublabel: 'Calorie deficit + cardio' },
    gain_muscle:     { emoji: '💪', sublabel: 'Calorie surplus + strength' },
    maintain:        { emoji: '⚖️', sublabel: 'Balanced nutrition' },
    recomp:          { emoji: '🔄', sublabel: 'Lose fat, build muscle' },
    stay_fit:        { emoji: '🏃', sublabel: 'General fitness & health' },
    improve_stamina: { emoji: '⚡', sublabel: 'Endurance & energy' },
  };

  const ACTIVITY_META: Record<string, string> = {
    sedentary: 'Desk job, little movement',
    light: '1–2 workouts per week',
    moderate: '3–4 workouts per week',
    active: '5–6 workouts per week',
    very_active: 'Athlete / physical job',
  };

  const animClass = direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left';

  return (
    <main className="min-h-screen bg-white flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="px-6 pt-10 pb-4">
        <div className="flex items-center gap-3 mb-6">
          {step > 0 && (
            <button
              onClick={goBack}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ background: '#f3f4f6' }}
              aria-label="Back"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="flex-1">
            {/* Progress bar */}
            <div className="flex gap-1 mb-2">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full transition-all duration-300"
                  style={{ background: i <= step ? '#16a34a' : '#e5e7eb' }}
                />
              ))}
            </div>
            <p className="text-xs font-semibold" style={{ color: '#16a34a' }}>
              Step {step + 1} of {TOTAL_STEPS}
            </p>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">{STEP_TITLES[step]}</h1>
      </div>

      {/* Step content */}
      <div key={step} className={`flex-1 px-6 pb-4 overflow-y-auto ${animClass}`}>

        {/* Step 0: Name */}
        {step === 0 && (
          <div className="flex flex-col gap-4 pt-2">
            <TextInput
              value={form.fullName}
              onChange={v => set('fullName', v)}
              placeholder="e.g. Rahul Sharma"
            />
            <p className="text-sm text-gray-400">We'll personalise your plan with this.</p>
          </div>
        )}

        {/* Step 1: Body details */}
        {step === 1 && (
          <div className="flex flex-col gap-4 pt-2">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Age</p>
              <TextInput value={form.age} onChange={v => set('age', v)} type="number" placeholder="25" suffix="yrs" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Gender</p>
              <div className="flex gap-2">
                {(['male', 'female', 'other'] as const).map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => set('gender', g)}
                    className="flex-1 py-3 rounded-2xl border-2 text-sm font-semibold capitalize transition-all"
                    style={{
                      borderColor: form.gender === g ? '#16a34a' : '#e5e7eb',
                      background: form.gender === g ? 'rgba(22,163,74,0.06)' : '#fff',
                      color: form.gender === g ? '#15803d' : '#6b7280',
                    }}
                  >
                    {g === 'male' ? '👨 Male' : g === 'female' ? '👩 Female' : '🧑 Other'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Height</p>
              <TextInput value={form.heightCm} onChange={v => set('heightCm', v)} type="number" placeholder="170" suffix="cm" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Current weight</p>
              <TextInput value={form.weightKg} onChange={v => set('weightKg', v)} type="number" placeholder="70" suffix="kg" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Goal weight <span className="text-gray-400 font-normal">(optional)</span></p>
              <TextInput value={form.goalWeightKg} onChange={v => set('goalWeightKg', v)} type="number" placeholder="65" suffix="kg" />
            </div>
          </div>
        )}

        {/* Step 2: Fitness goal */}
        {step === 2 && (
          <div className="flex flex-col gap-2 pt-2">
            {FITNESS_GOALS.map(g => (
              <OptionCard
                key={g.value}
                label={g.label}
                sublabel={GOAL_META[g.value]?.sublabel}
                emoji={GOAL_META[g.value]?.emoji}
                selected={form.fitnessGoal === g.value}
                onClick={() => set('fitnessGoal', g.value as FitnessGoal)}
              />
            ))}
          </div>
        )}

        {/* Step 3: Diet preference */}
        {step === 3 && (
          <div className="flex flex-col gap-2 pt-2">
            {DIET_PREFERENCES.map(d => {
              const DIET_EMOJI: Record<string, string> = { veg: '🥦', nonveg: '🍗', eggetarian: '🥚', jain: '🌱', vegan: '🌿' };
              return (
                <OptionCard
                  key={d.value}
                  label={d.label}
                  sublabel={d.labelHi}
                  emoji={DIET_EMOJI[d.value]}
                  selected={form.dietPreference === d.value}
                  onClick={() => set('dietPreference', d.value as DietPreference)}
                />
              );
            })}
          </div>
        )}

        {/* Step 4: Activity level */}
        {step === 4 && (
          <div className="flex flex-col gap-2 pt-2">
            {ACTIVITY_LEVELS.map(a => (
              <OptionCard
                key={a.value}
                label={a.label.split('(')[0].trim()}
                sublabel={ACTIVITY_META[a.value]}
                selected={form.activityLevel === a.value}
                onClick={() => set('activityLevel', a.value as ActivityLevel)}
              />
            ))}
          </div>
        )}

        {/* Step 5: Daily food budget */}
        {step === 5 && (
          <div className="flex flex-col gap-6 pt-2">
            <p className="text-sm text-gray-500">How much do you typically spend on food per day?</p>
            <div className="text-center">
              <span className="text-4xl font-black text-gray-900">₹{form.dailyFoodBudget}</span>
              <p className="text-sm text-gray-400 mt-1">per day</p>
            </div>
            <input
              type="range"
              min={100}
              max={600}
              step={50}
              value={form.dailyFoodBudget}
              onChange={e => set('dailyFoodBudget', parseInt(e.target.value))}
              className="w-full accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>₹100</span>
              <span>₹600</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[150, 250, 400].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => set('dailyFoodBudget', amt)}
                  className="py-2 rounded-xl text-sm font-semibold border-2 transition-all"
                  style={{
                    borderColor: form.dailyFoodBudget === amt ? '#16a34a' : '#e5e7eb',
                    background: form.dailyFoodBudget === amt ? 'rgba(22,163,74,0.06)' : '#fff',
                    color: form.dailyFoodBudget === amt ? '#15803d' : '#6b7280',
                  }}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Language */}
        {step === 6 && (
          <div className="flex flex-col gap-2 pt-2">
            <p className="text-sm text-gray-500 mb-2">Your AI coach will respond in this language.</p>
            {LANGUAGES.map(l => {
              const LANG_DESC: Record<string, string> = { en: 'English only', hi: 'Hindi only', 'hi-en': 'Mix of Hindi + English' };
              return (
                <OptionCard
                  key={l.value}
                  label={l.label}
                  sublabel={LANG_DESC[l.value]}
                  selected={form.preferredLanguage === l.value}
                  onClick={() => set('preferredLanguage', l.value as Language)}
                />
              );
            })}
          </div>
        )}

        {/* Step 7: Gym access + workout level */}
        {step === 7 && (
          <div className="flex flex-col gap-4 pt-2">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Where do you work out?</p>
              <div className="flex flex-col gap-2">
                {GYM_ACCESS_OPTIONS.map(g => (
                  <OptionCard
                    key={g.value}
                    label={g.label}
                    sublabel={g.desc}
                    emoji={g.emoji}
                    selected={form.gymAccess === g.value}
                    onClick={() => set('gymAccess', g.value as GymAccess)}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Experience level</p>
              <div className="flex flex-col gap-2">
                {WORKOUT_LEVELS.map(w => {
                  const LEVEL_EMOJI: Record<string, string> = { beginner: '🌱', intermediate: '🏋️', advanced: '🚀' };
                  return (
                    <OptionCard
                      key={w.value}
                      label={w.label.split('(')[0].trim()}
                      sublabel={w.label.match(/\(([^)]+)\)/)?.[1]}
                      emoji={LEVEL_EMOJI[w.value]}
                      selected={form.workoutLevel === w.value}
                      onClick={() => set('workoutLevel', w.value as WorkoutLevel)}
                    />
                  );
                })}
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl">{error}</p>
            )}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="px-6 pb-10 pt-4" style={{ borderTop: '1px solid #f3f4f6' }}>
        {step < TOTAL_STEPS - 1 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={!canAdvance()}
            className="w-full py-4 rounded-2xl font-bold text-base text-white transition-all active:scale-95 disabled:opacity-40"
            style={{ background: '#16a34a' }}
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            disabled={!canAdvance() || saving}
            className="w-full py-4 rounded-2xl font-bold text-base text-white transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
            style={{ background: '#16a34a' }}
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Setting up your plan…
              </>
            ) : (
              user ? 'Start my journey 🚀' : 'Create account →'
            )}
          </button>
        )}
      </div>
    </main>
  );
}
