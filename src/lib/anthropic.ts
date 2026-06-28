// src/lib/anthropic.ts
// Gọi qua Supabase Edge Function — API key không bao giờ ở client

import { supabase } from './supabase'
import type { ChatMessageUI } from '@/types'

export async function sendMessageToCoach(
  messages: ChatMessageUI[],
  sessionId: string
): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Chưa đăng nhập')

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
  const res = await fetch(`${supabaseUrl}/functions/v1/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      session_id: sessionId,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? `Lỗi kết nối (${res.status})`)
  }

  const data = await res.json() as { reply: string }
  return data.reply
}
