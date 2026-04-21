'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { getWeightHistory } from '@/services/supabase';
import type { WeightLog } from '@/types';

const TABS = ['1W', '2W', '1M'] as const;
type Tab = typeof TABS[number];

function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return <div className="h-16 flex items-center justify-center text-gray-300 text-sm">Not enough data</div>;
  const w = 280, h = 64, pad = 4;
  const min = Math.min(...data) - 1;
  const max = Math.max(...data) + 1;
  const xs = data.map((_, i) => pad + (i / (data.length - 1)) * (w - pad * 2));
  const ys = data.map(v => h - pad - ((v - min) / (max - min)) * (h - pad * 2));
  const points = xs.map((x, i) => `${x},${ys[i]}`).join(' ');
  const area = `M${xs[0]},${ys[0]} ${xs.slice(1).map((x, i) => `L${x},${ys[i + 1]}`).join(' ')} L${xs[xs.length - 1]},${h} L${xs[0]},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16">
      <defs>
        <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#wg)" />
      <polyline points={points} fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="4" fill="#4ade80" />
    </svg>
  );
}

function StatCard({ label, value, unit, color }: { label: string; value: string | number; unit?: string; color: string }) {
  return (
    <div className="flex-1 bg-white rounded-2xl p-4">
      <p className="text-xs font-medium text-gray-400 mb-1">{label}</p>
      <p className="font-black text-xl" style={{ color }}>
        {value}<span className="text-sm font-semibold text-gray-400 ml-0.5">{unit}</span>
      </p>
    </div>
  );
}

export default function ProgressPage() {
  const { user, profile } = useUser();
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [tab, setTab] = useState<Tab>('1W');
  const [loading, setLoading] = useState(true);
  const [newWeight, setNewWeight] = useState('');

  useEffect(() => {
    if (!user) return;
    const days = tab === '1W' ? 7 : tab === '2W' ? 14 : 30;
    getWeightHistory(user.id, days)
      .then(setLogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, tab]);

  const weights = logs.map(l => l.weightKg);
  const latest  = weights[weights.length - 1] ?? profile?.weightKg ?? 0;
  const start   = weights[0] ?? latest;
  const change  = +(latest - start).toFixed(1);
  const streak  = logs.length;

  return (
    <div className="min-h-screen" style={{ background: '#0f172a' }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-6" style={{ background: '#0f172a' }}>
        <p className="text-xs font-semibold mb-1" style={{ color: '#7dd3fc' }}>Your progress</p>
        <h1 className="text-2xl font-black text-white mb-1">Weight Tracker</h1>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-black text-white">{latest}</span>
          <span className="text-lg font-semibold mb-1" style={{ color: '#7dd3fc' }}>kg</span>
          {change !== 0 && (
            <span className="text-sm font-bold mb-1.5" style={{ color: change < 0 ? '#4ade80' : '#f87171' }}>
              {change > 0 ? '+' : ''}{change} kg
            </span>
          )}
        </div>
      </div>

      <div className="mx-4 space-y-4">
        {/* Chart card */}
        <div className="rounded-3xl bg-white p-5 shadow-xl">
          {/* Tabs */}
          <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-xl">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all"
                style={{
                  background: tab === t ? '#fff' : 'transparent',
                  color: tab === t ? '#16a34a' : '#9ca3af',
                  boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {t}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <Sparkline data={weights} />
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-3">
          <StatCard label="Lost" value={change < 0 ? Math.abs(change) : 0} unit="kg" color="#16a34a" />
          <StatCard label="Log streak" value={streak} unit="days" color="#7c3aed" />
        </div>
        <div className="flex gap-3">
          <StatCard label="Goal weight" value={profile?.goalWeightKg ?? '—'} unit={profile?.goalWeightKg ? 'kg' : ''} color="#0284c7" />
          <StatCard label="TDEE" value={profile?.tdee ?? '—'} unit={profile?.tdee ? 'kcal' : ''} color="#ea580c" />
        </div>

        {/* Log weight */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="font-semibold text-gray-800 mb-3 text-sm">Log today's weight</p>
          <div className="flex gap-2">
            <input
              type="number"
              value={newWeight}
              onChange={e => setNewWeight(e.target.value)}
              placeholder={`${latest} kg`}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              className="px-4 py-2.5 rounded-xl font-bold text-white text-sm"
              style={{ background: '#16a34a' }}
              onClick={() => {/* TODO */}}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
