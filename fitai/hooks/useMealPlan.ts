'use client';

import { useEffect, useState, useCallback } from 'react';
import { getTodayMealPlan } from '@/services/supabase';
import type { MealPlan } from '@/types';

export interface UseMealPlanReturn {
  mealPlan: MealPlan | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useMealPlan(userId: string | undefined): UseMealPlanReturn {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const plan = await getTodayMealPlan(userId);
      setMealPlan(plan);
    } catch (e) {
      setError((e as Error).message ?? 'Failed to load meal plan');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { mealPlan, loading, error, refresh: fetch };
}
