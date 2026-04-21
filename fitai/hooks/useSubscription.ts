'use client';

import { useEffect, useState } from 'react';
import { getUserSubscription } from '@/services/supabase';
import { PLAN_LIMITS } from '@/lib/constants';
import type { Subscription, PlanId } from '@/types';

export interface UseSubscriptionReturn {
  subscription: Subscription | null;
  planId: PlanId;
  limits: (typeof PLAN_LIMITS)[PlanId];
  isProUser: boolean;
  loading: boolean;
}

export function useSubscription(userId: string | undefined): UseSubscriptionReturn {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    getUserSubscription(userId)
      .then(setSubscription)
      .catch(() => setSubscription(null))
      .finally(() => setLoading(false));
  }, [userId]);

  const planId: PlanId = subscription?.status === 'active' ? subscription.planId : 'free';
  const limits = PLAN_LIMITS[planId];
  const isProUser = planId !== 'free';

  return { subscription, planId, limits, isProUser, loading };
}
