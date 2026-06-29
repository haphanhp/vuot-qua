import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type CravingLog = {
  id: string
  user_id: string
  trigger: string
  intensity: number
  note: string | null
  outcome: 'overcame' | 'relapse' | 'in_progress'
  created_at: string
}

export type Profile = {
  id: string
  email: string
  display_name: string | null
  addiction_type: string
  start_date: string
  current_streak: number
  best_streak: number
  created_at: string
}

export type ChatMessage = {
  id: string
  user_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}
