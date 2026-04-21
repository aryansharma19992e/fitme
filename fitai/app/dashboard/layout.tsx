'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import BottomNav from '@/components/ui/BottomNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace('/login'); return; }
    // If profile loaded and onboarding not done, send them there
    if (profile !== null && !profile.onboardingComplete) router.replace('/onboarding');
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative">
      <div className="pb-20">{children}</div>
      <BottomNav />
    </div>
  );
}
