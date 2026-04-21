'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { getWeekWorkoutPlan } from '@/services/supabase';
import type { WorkoutPlan, WorkoutDay } from '@/types';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function WeekSelector({ days, selected, onSelect }: {
  days: WorkoutDay[];
  selected: number;
  onSelect: (idx: number) => void;
}) {
  const today = new Date().getDay();
  return (
    <div className="flex gap-1.5">
      {DAYS.map((d, i) => {
        const hasDay = days.find(day => day.dayOfWeek === i);
        const isToday = i === today;
        const isSelected = i === selected;
        return (
          <button
            key={i}
            onClick={() => hasDay && onSelect(i)}
            className="flex-1 flex flex-col items-center py-2 rounded-xl text-xs font-bold transition-all"
            style={{
              background: isSelected ? '#16a34a' : isToday ? 'rgba(22,163,74,0.12)' : 'rgba(255,255,255,0.08)',
              color: isSelected ? '#fff' : hasDay ? '#e5e7eb' : 'rgba(255,255,255,0.3)',
            }}
          >
            <span>{d}</span>
            {hasDay && !hasDay.isRestDay && (
              <span className="w-1 h-1 rounded-full mt-1" style={{ background: isSelected ? '#fff' : '#4ade80' }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

function ExerciseItem({ name, sets }: { name: string; sets: { reps?: number; weightKg?: number; durationSeconds?: number }[] }) {
  const [logged, setLogged] = useState(false);
  const setDesc = sets.map(s => {
    if (s.durationSeconds) return `${s.durationSeconds}s`;
    return `${s.reps ?? '?'} reps${s.weightKg ? ` · ${s.weightKg}kg` : ''}`;
  }).join(' / ');

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background: '#f0fdf4' }}>
        💪
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm truncate">{name}</p>
        <p className="text-xs text-gray-400">{sets.length} sets · {setDesc}</p>
      </div>
      <button
        onClick={() => setLogged(l => !l)}
        className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
        style={{
          background: logged ? '#16a34a' : 'transparent',
          color: logged ? '#fff' : '#16a34a',
          border: `1.5px solid ${logged ? '#16a34a' : '#16a34a'}`,
        }}
      >
        {logged ? 'Done ✓' : 'Log'}
      </button>
    </div>
  );
}

export default function WorkoutPage() {
  const { user } = useUser();
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());

  useEffect(() => {
    if (!user) return;
    getWeekWorkoutPlan(user.id)
      .then(setPlan)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const activeDay = plan?.days.find(d => d.dayOfWeek === selectedDay);

  return (
    <div className="min-h-screen" style={{ background: '#1e1b4b' }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-6" style={{ background: '#1e1b4b' }}>
        <p className="text-xs font-semibold mb-1" style={{ color: '#a5b4fc' }}>This week</p>
        <h1 className="text-2xl font-black text-white mb-4">Workout Plan</h1>
        {plan ? (
          <WeekSelector days={plan.days} selected={selectedDay} onSelect={setSelectedDay} />
        ) : (
          <div className="flex gap-1.5">
            {DAYS.map((_, i) => (
              <div key={i} className="flex-1 h-9 rounded-xl" style={{ background: 'rgba(255,255,255,0.08)' }} />
            ))}
          </div>
        )}
      </div>

      {/* Content card */}
      <div className="mx-4 rounded-3xl bg-white shadow-xl p-5 min-h-64">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-7 h-7 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !plan ? (
          <div className="text-center py-8">
            <p className="text-3xl mb-3">🏋️</p>
            <p className="text-gray-600 font-semibold mb-1">No workout plan yet</p>
            <p className="text-sm text-gray-400 mb-4">Generate a personalised weekly workout plan</p>
            <button
              className="px-6 py-3 rounded-2xl font-bold text-white text-sm"
              style={{ background: '#4f46e5' }}
            >
              Generate Workout Plan
            </button>
          </div>
        ) : !activeDay ? (
          <div className="text-center py-8">
            <p className="text-3xl mb-2">😴</p>
            <p className="text-gray-600 font-semibold">Rest Day</p>
            <p className="text-sm text-gray-400 mt-1">Recovery is part of the plan!</p>
          </div>
        ) : activeDay.isRestDay ? (
          <div className="text-center py-8">
            <p className="text-3xl mb-2">😴</p>
            <p className="text-gray-600 font-semibold">Rest Day</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-gray-900">{activeDay.label}</h2>
                {activeDay.estimatedDurationMinutes && (
                  <p className="text-xs text-gray-400">{activeDay.estimatedDurationMinutes} min · {activeDay.exercises.length} exercises</p>
                )}
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#ede9fe', color: '#7c3aed' }}>
                {activeDay.exercises.length} exercises
              </span>
            </div>
            {activeDay.exercises.map((ex, i) => (
              <ExerciseItem key={i} name={ex.exerciseName} sets={ex.sets} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
