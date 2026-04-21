'use client';

import { useState } from 'react';
import Link from 'next/link';

const FREE_FEATURES = [
  '5 AI chats per day',
  '1 meal plan per week',
  '1 workout plan per week',
  '3 food scans per day',
  'Weight tracking',
];

const PRO_FEATURES = [
  'Unlimited AI coaching',
  'Daily meal plans',
  'Weekly workout plans',
  'Unlimited food scans',
  'Progress charts',
  'Hindi & Hinglish support',
  'Priority support',
];

function CheckIcon({ color = '#16a34a' }: { color?: string }) {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  const proPrice = annual ? Math.round(1999 / 12) : 499;
  const proTotal = annual ? '₹1,999/yr' : '₹499/mo';

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-5 pt-12 pb-6 text-center" style={{ background: '#0d1f12' }}>
        <Link href="/" className="flex items-center gap-2 justify-center mb-6">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#16a34a' }}>
            <span className="text-white text-xs font-black">F</span>
          </div>
          <span className="text-base font-black text-white">FitAI</span>
        </Link>
        <h1 className="text-3xl font-black text-white mb-2">Simple pricing</h1>
        <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>Start free, upgrade when you're ready</p>

        {/* Monthly / Yearly toggle */}
        <div className="inline-flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <button
            onClick={() => setAnnual(false)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: !annual ? '#fff' : 'transparent', color: !annual ? '#111827' : 'rgba(255,255,255,0.7)' }}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5"
            style={{ background: annual ? '#fff' : 'transparent', color: annual ? '#111827' : 'rgba(255,255,255,0.7)' }}
          >
            Annual
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md" style={{ background: '#4ade80', color: '#14532d' }}>
              -33%
            </span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="px-4 py-6 space-y-4 max-w-md mx-auto">

        {/* Free plan */}
        <div className="rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Free</p>
          <div className="flex items-end gap-1 mb-4">
            <span className="text-4xl font-black text-gray-900">₹0</span>
            <span className="text-sm text-gray-400 mb-1">/month</span>
          </div>
          <ul className="space-y-2 mb-5">
            {FREE_FEATURES.map(f => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckIcon color="#16a34a" />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/onboarding"
            className="block w-full text-center py-3 rounded-xl font-semibold text-sm border-2 border-gray-200 text-gray-700 hover:border-gray-300 transition-colors"
          >
            Get started free
          </Link>
        </div>

        {/* Pro plan */}
        <div className="rounded-2xl p-5 relative" style={{ background: '#0d1f12' }}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="px-4 py-1 rounded-full text-xs font-bold" style={{ background: '#4ade80', color: '#14532d' }}>
              Most Popular
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#4ade80' }}>Pro</p>
          <div className="flex items-end gap-1 mb-1">
            <span className="text-4xl font-black text-white">₹{proPrice}</span>
            <span className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>/month</span>
          </div>
          {annual && (
            <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Billed as {proTotal}</p>
          )}
          <ul className="space-y-2 mb-5">
            {PRO_FEATURES.map(f => (
              <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
                <CheckIcon color="#4ade80" />
                {f}
              </li>
            ))}
          </ul>
          <button
            className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all active:scale-95"
            style={{ background: '#16a34a' }}
            onClick={() => {/* TODO: Razorpay */}}
          >
            Start Pro — {proTotal}
          </button>
        </div>

        {/* FAQ note */}
        <p className="text-center text-xs text-gray-400 pb-4">
          Secure payment via Razorpay · Cancel anytime · No hidden fees
        </p>
      </div>
    </main>
  );
}
