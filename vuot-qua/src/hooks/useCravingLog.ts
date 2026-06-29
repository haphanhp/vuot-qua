// src/hooks/useCravingLog.ts
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { CravingLog, TriggerType, ActionTaken, Outcome } from '@/types'

interface LogCravingInput {
  trigger_type?: TriggerType
  intensity?: number
  note?: string
  action_taken?: ActionTaken
  outcome?: Outcome
  duration_minutes?: number
}

export function useCravingLog() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function logCraving(input: LogCravingInput): Promise<CravingLog | null> {
    setLoading(true)
    setError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Chưa đăng nhập')

      const { data, error: dbError } = await supabase
        .from('craving_logs')
        .insert({ user_id: user.id, ...input })
        .select()
        .single()

      if (dbError) throw dbError
      return data as CravingLog
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi ghi log'
      setError(msg)
      return null
    } finally {
      setLoading(false)
    }
  }

  async function getRecentLogs(limit = 20): Promise<CravingLog[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data } = await supabase
      .from('craving_logs')
      .select('id, user_id, trigger_type, intensity, note, action_taken, outcome, duration_minutes, logged_at')
      .eq('user_id', user.id)
      .order('logged_at', { ascending: false })
      .limit(limit)

    return (data ?? []) as CravingLog[]
  }

  async function getWeeklyStats() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { total: 0, overcame: 0, relapsed: 0 }

    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const { data } = await supabase
      .from('craving_logs')
      .select('outcome')
      .eq('user_id', user.id)
      .gte('logged_at', weekAgo.toISOString())

    const logs = (data ?? []) as { outcome: Outcome | null }[]
    return {
      total: logs.length,
      overcame: logs.filter(l => l.outcome === 'overcame').length,
      relapsed: logs.filter(l => l.outcome === 'relapsed').length,
    }
  }

  return { logCraving, getRecentLogs, getWeeklyStats, loading, error }
}
