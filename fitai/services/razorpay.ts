// ALL Razorpay logic — never import Razorpay outside this file

import Razorpay from 'razorpay';
import crypto from 'crypto';
import type { PlanId } from '@/types';

function getClient(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error('Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET');
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export interface RazorpaySubscriptionResult {
  subscriptionId: string;
  shortUrl: string;
}

export async function createSubscription(
  userId: string,
  planId: Extract<PlanId, 'pro_monthly' | 'pro_annual'>
): Promise<RazorpaySubscriptionResult> {
  const rp = getClient();

  // total_count: annual plans bill once, monthly plans bill up to 12 times
  const subscription = await rp.subscriptions.create({
    plan_id: process.env[`RAZORPAY_PLAN_ID_${planId.toUpperCase()}`] ?? '',
    total_count: planId === 'pro_annual' ? 1 : 12,
    quantity: 1,
    customer_notify: 1,
    notes: { userId, planId },
  });

  return {
    subscriptionId: subscription.id,
    shortUrl: (subscription as unknown as Record<string, unknown>).short_url as string ?? '',
  };
}

export interface WebhookVerifyResult {
  valid: boolean;
  event?: string;
  payload?: Record<string, unknown>;
}

export function verifyWebhookSignature(
  rawBody: string,
  signature: string
): WebhookVerifyResult {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw new Error('Missing RAZORPAY_WEBHOOK_SECRET');

  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  if (expected !== signature) return { valid: false };

  const payload = JSON.parse(rawBody);
  return { valid: true, event: payload.event, payload };
}

export function getRazorpayKeyId(): string {
  const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!key) throw new Error('Missing NEXT_PUBLIC_RAZORPAY_KEY_ID');
  return key;
}
