'use client';

import { useEffect, useState, useCallback } from 'react';
import { getWeekWorkoutPlan } from '@/services/supabase';
import type { WorkoutPlan } from '@/types';

export interface UseWorkoutReturn {
  workoutPlan: WorkoutPlan | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useWorkout(userId: string | undefined): UseWorkoutReturn {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const plan = await getWeekWorkoutPlan(userId);
      setWorkoutPlan(plan);
    } catch (e) {
      setError((e as Error).message ?? 'Failed to load workout plan');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { workoutPlan, loading, error, refresh: fetch };
}
