import { NextRequest, NextResponse } from 'next/server';

// Auth is now handled client-side at /auth/callback (PKCE flow requires browser).
// This route exists as a fallback in case anything still points here.
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '';

  // Forward to the client-side callback page with the same params
  const dest = new URL('/auth/callback', origin);
  if (code) dest.searchParams.set('code', code);
  if (next) dest.searchParams.set('next', next);

  return NextResponse.redirect(dest);
}
