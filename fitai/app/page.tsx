'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/hooks/useUser';

const FEATURES = [
  { emoji: '🍛', text: 'Knows Indian food' },
  { emoji: '🗣️', text: 'Speaks Hindi & English' },
  { emoji: '💪', text: 'AI workout plans' },
  { emoji: '📊', text: 'Track progress' },
];

const AVATARS = ['👨‍💼', '👩‍🦱', '🧑', '👨‍🦳', '👩'];

export default function LandingPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard/nutrition');
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d1f12' }}>
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#16a34a', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ background: '#0d1f12' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-12 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#16a34a' }}>
            <span className="text-white text-sm font-black">F</span>
          </div>
          <span className="text-lg font-black text-white">FitAI</span>
        </div>
        <Link
          href="/login"
          className="text-sm font-semibold px-4 py-2 rounded-xl border text-white/80 hover:bg-white/10 transition-colors"
          style={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          Log in
        </Link>
      </div>

      {/* Hero */}
      <div className="flex-1 px-6 pt-10 pb-8 flex flex-col">
        {/* Beta badge */}
        <div className="mb-6">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest"
            style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80' }}
          >
            FITAI BETA
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-black text-white leading-tight mb-3">
          Your AI<br />
          <span style={{ color: '#4ade80' }}>Fitness Coach</span>
        </h1>
        <p className="text-base mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Personalized meal plans, workouts &amp; coaching — built for India.
        </p>

        {/* Feature chips */}
        <div className="flex flex-wrap gap-2 mb-10">
          {FEATURES.map(f => (
            <span
              key={f.text}
              className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)' }}
            >
              <span>{f.emoji}</span>
              {f.text}
            </span>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col gap-3 mb-10">
          <Link
            href="/onboarding"
            className="w-full text-center py-4 rounded-2xl font-bold text-base text-white transition-all active:scale-95"
            style={{ background: '#16a34a' }}
          >
            Start Free — No Card Needed
          </Link>
          <Link
            href="/login"
            className="w-full text-center py-4 rounded-2xl font-semibold text-base border text-white/80 hover:bg-white/10 transition-colors"
            style={{ borderColor: 'rgba(255,255,255,0.2)' }}
          >
            Log in to your account
          </Link>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {AVATARS.map((a, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full flex items-center justify-center text-base border-2"
                style={{ background: '#1a3a22', borderColor: '#0d1f12' }}
              >
                {a}
              </div>
            ))}
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <span className="text-white font-bold">12,400+</span> Indians using FitAI
          </p>
        </div>
      </div>

      {/* Bottom gradient bar */}
      <div className="h-1 mx-6 mb-8 rounded-full" style={{ background: 'linear-gradient(90deg, #16a34a, #4ade80, #16a34a)' }} />
    </main>
  );
}
