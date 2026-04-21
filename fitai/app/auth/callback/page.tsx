'use client';

// Client-side callback page — required for Supabase PKCE flow.
// The Supabase JS client stores the code verifier in localStorage (browser-only),
// so code exchange MUST happen client-side, not in a server API route.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, getProfile } from '@/services/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Signing you in…');

  useEffect(() => {
    // onAuthStateChange fires automatically once the Supabase client
    // detects the ?code= param in the URL and exchanges it for a session.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setStatus('Setting up your account…');
          try {
            const profile = await getProfile(session.user.id);
            // Only skip onboarding if it was fully completed
            router.replace(profile.onboardingComplete ? '/dashboard/nutrition' : '/onboarding');
          } catch {
            // New user — no profile yet
            router.replace('/onboarding');
          }
        }

        if (event === 'SIGNED_OUT') {
          router.replace('/login');
        }
      }
    );

    // Fallback: if already signed in when this page loads (e.g. magic link)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setStatus('Setting up your account…');
        try {
          const profile = await getProfile(session.user.id);
          router.replace(profile.onboardingComplete ? '/dashboard/nutrition' : '/onboarding');
        } catch {
          router.replace('/onboarding');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 text-sm font-medium">{status}</p>
    </div>
  );
}
