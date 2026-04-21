'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@/hooks/useUser';
import { getChatHistory } from '@/services/supabase';
import { apiChat } from '@/services/api';
import type { ChatMessage } from '@/types';

const QUICK_REPLIES = [
  'What should I eat for breakfast?',
  'Give me a high-protein snack idea',
  'How many calories did I burn today?',
  'Motivate me!',
];

function Bubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1" style={{ background: '#16a34a' }}>
          <span className="text-sm">🤖</span>
        </div>
      )}
      <div
        className="max-w-xs px-4 py-3 rounded-2xl text-sm leading-relaxed"
        style={{
          background: isUser ? '#16a34a' : '#f3f4f6',
          color: isUser ? '#fff' : '#1f2937',
          borderBottomRightRadius: isUser ? 4 : undefined,
          borderBottomLeftRadius: isUser ? undefined : 4,
        }}
      >
        {msg.content}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { user, profile, session } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    getChatHistory(user.id, 30).then(setMessages).catch(console.error);
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || !user || !session || sending) return;
    setSending(true);
    setInput('');

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      userId: user.id,
      role: 'user',
      content: text.trim(),
      language: profile?.preferredLanguage ?? 'en',
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const result = await apiChat(session.access_token, {
        userId: user.id,
        message: text.trim(),
        language: profile?.preferredLanguage ?? 'en',
        conversationHistory: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
      });

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        userId: user.id,
        role: 'assistant',
        content: result.reply,
        language: profile?.preferredLanguage ?? 'en',
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#16a34a' }}>
          <span className="text-lg">🤖</span>
        </div>
        <div>
          <h1 className="font-black text-gray-900">FitAI Coach</h1>
          <p className="text-xs text-green-600 font-medium">● Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isEmpty && (
          <div className="flex flex-col items-center justify-center h-full pb-20 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#f0fdf4' }}>
              <span className="text-3xl">🤖</span>
            </div>
            <h2 className="font-bold text-gray-800 mb-1">Hey {profile?.fullName?.split(' ')[0] ?? 'there'}!</h2>
            <p className="text-sm text-gray-400 max-w-xs">
              Ask me anything about your nutrition, workouts, or health. I know Indian food!
            </p>
          </div>
        )}
        {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}
        {sending && (
          <div className="flex justify-start mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 mt-1" style={{ background: '#16a34a' }}>
              <span className="text-sm">🤖</span>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-gray-100" style={{ borderBottomLeftRadius: 4 }}>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      {isEmpty && (
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto">
          {QUICK_REPLIES.map(q => (
            <button
              key={q}
              onClick={() => send(q)}
              className="flex-shrink-0 px-3 py-2 rounded-full text-xs font-semibold border transition-colors"
              style={{ borderColor: '#e5e7eb', color: '#374151', background: '#fff' }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="px-4 pb-6 pt-2 border-t border-gray-100 flex gap-2 items-end">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
          placeholder="Ask your FitAI coach..."
          rows={1}
          className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          style={{ maxHeight: 96 }}
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || sending}
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
          style={{ background: '#16a34a' }}
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
