'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import Button from '@/components/ui/Button';

type Step = 'input' | 'sent';

export default function LoginPage() {
  const { user, loading, signInWithGoogle, signInWithEmail } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [step, setStep] = useState<Step>('input');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Already logged in → go to dashboard
  useEffect(() => {
    if (!loading && user) router.replace('/dashboard/nutrition');
  }, [user, loading, router]);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setError('');
    setSubmitting(true);
    try {
      await signInWithEmail(email.trim().toLowerCase());
      setStep('sent');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-10 justify-center">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl font-black">F</span>
          </div>
          <span className="text-2xl font-black text-gray-900">FitAI</span>
        </div>

        {step === 'input' ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">Welcome back</h1>
            <p className="text-gray-500 text-sm text-center mb-8">Sign in to continue your fitness journey</p>

            {/* Google OAuth */}
            <Button
              variant="secondary"
              size="lg"
              className="w-full mb-4"
              onClick={signInWithGoogle}
            >
              <svg className="w-5 h-5 mr-2 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">or use email</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Email magic link */}
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}

              <Button type="submit" size="lg" loading={submitting} className="w-full">
                Send magic link
              </Button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-4">
              We'll email you a link — no password needed.
            </p>
          </>
        ) : (
          /* Magic link sent confirmation */
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">📬</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
            <p className="text-gray-500 text-sm mb-2">
              We sent a magic link to
            </p>
            <p className="font-semibold text-gray-900 mb-6">{email}</p>
            <p className="text-gray-400 text-xs mb-8">
              Click the link in the email to sign in. It expires in 1 hour.
            </p>
            <button
              onClick={() => { setStep('input'); setError(''); }}
              className="text-green-600 text-sm font-medium hover:underline"
            >
              Use a different email
            </button>
          </div>
        )}

        {/* Back to home */}
        <p className="text-center text-sm text-gray-400 mt-10">
          New here?{' '}
          <Link href="/onboarding" className="text-green-600 font-medium hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}
