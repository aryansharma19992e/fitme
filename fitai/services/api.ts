// REST API wrappers — all fetch() calls live here, never in pages/components
// React Native will call these same functions pointed at the deployed URL

import type { ChatRequest, GenerateMealPlanRequest, ApiResponse, MealPlan } from '@/types';

async function post<T>(path: string, token: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  const json: ApiResponse<T> = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data as T;
}

export async function apiChat(
  token: string,
  payload: ChatRequest
): Promise<{ reply: string }> {
  return post('/api/chat', token, payload);
}

export async function apiGenerateMealPlan(
  token: string,
  payload: GenerateMealPlanRequest
): Promise<MealPlan> {
  return post('/api/meal-plan/generate', token, payload);
}
