import { NextRequest, NextResponse } from 'next/server';
import {
  getServiceSupabase, getProfile, saveMealPlan,
  getTodayMealPlan, getMealPlanCountThisMonth, getUserSubscription,
} from '@/services/supabase';
import { generateMealPlan } from '@/services/claude';

const FREE_PLAN_MONTHLY_LIMIT = 3;

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? '';
  const token = auth.replace('Bearer ', '').trim();
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sb = getServiceSupabase();
  const { data: { user }, error: authErr } = await sb.auth.getUser(token);
  if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const date = (await req.json().catch(() => ({}))).date ?? new Date().toISOString().split('T')[0];

  try {
    const profile = await getProfile(user.id);

    // Return cached plan for today if one already exists
    const existing = await getTodayMealPlan(user.id);
    if (existing && existing.date === date) {
      return NextResponse.json({ data: existing, cached: true });
    }

    // Rate limiting for free users
    const subscription = await getUserSubscription(user.id);
    const isPro = subscription && subscription.status === 'active' && subscription.planId !== 'free';
    if (!isPro) {
      const count = await getMealPlanCountThisMonth(user.id);
      if (count >= FREE_PLAN_MONTHLY_LIMIT) {
        return NextResponse.json(
          { error: `Free plan allows ${FREE_PLAN_MONTHLY_LIMIT} AI meal plans per month. Upgrade to Pro for unlimited.` },
          { status: 429 }
        );
      }
    }

    const generated = await generateMealPlan({ userId: user.id, date }, profile);
    const plan = await saveMealPlan({ ...generated, userId: user.id, date, aiGenerated: true });

    return NextResponse.json({ data: plan });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    console.error('[meal-plan/generate]', msg);
    if (msg.includes('ANTHROPIC_API_KEY')) {
      return NextResponse.json({ error: 'AI not configured — add ANTHROPIC_API_KEY to .env.local' }, { status: 503 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
