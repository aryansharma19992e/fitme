import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase, getProfile, saveChatMessage } from '@/services/supabase';
import { chatWithCoach } from '@/services/claude';
import type { ChatRequest } from '@/types';

export async function POST(req: NextRequest) {
  // Verify Bearer token
  const auth = req.headers.get('authorization') ?? '';
  const token = auth.replace('Bearer ', '').trim();
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sb = getServiceSupabase();
  const { data: { user }, error: authErr } = await sb.auth.getUser(token);
  if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: ChatRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.message?.trim()) return NextResponse.json({ error: 'message is required' }, { status: 400 });

  try {
    const profile = await getProfile(user.id);

    const [reply] = await Promise.all([
      chatWithCoach({ ...body, userId: user.id }, profile),
      saveChatMessage({ userId: user.id, role: 'user', content: body.message, language: body.language ?? profile.preferredLanguage ?? 'en' }),
    ]);

    await saveChatMessage({ userId: user.id, role: 'assistant', content: reply, language: body.language ?? profile.preferredLanguage ?? 'en' });

    return NextResponse.json({ data: { reply } });
  } catch (err: unknown) {
    console.error('chat error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
