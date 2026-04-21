'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  {
    href: '/dashboard/nutrition',
    label: 'Nutrition',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill={active ? '#16a34a' : 'none'} stroke={active ? '#16a34a' : '#9ca3af'} strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    href: '/dashboard/workout',
    label: 'Workout',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill={active ? '#16a34a' : 'none'} stroke={active ? '#16a34a' : '#9ca3af'} strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15M4.5 12a2.5 2.5 0 010-5M4.5 12a2.5 2.5 0 000 5M19.5 12a2.5 2.5 0 010-5M19.5 12a2.5 2.5 0 000 5M2 12h1M21 12h1M7 7v10M17 7v10" />
      </svg>
    ),
  },
  {
    href: '/dashboard/chat',
    label: 'AI Coach',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill={active ? '#16a34a' : 'none'} stroke={active ? '#16a34a' : '#9ca3af'} strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    href: '/dashboard/progress',
    label: 'Progress',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill={active ? '#16a34a' : 'none'} stroke={active ? '#16a34a' : '#9ca3af'} strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 max-w-md mx-auto">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 flex-1 py-2 transition-colors"
            >
              {item.icon(active)}
              <span className="text-xs font-medium" style={{ color: active ? '#16a34a' : '#9ca3af' }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
