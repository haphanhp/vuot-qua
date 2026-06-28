// src/hooks/useStreak.ts
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { calculateStreak } from '@/lib/streak'
import type { UserProfile } from '@/types'

interface StreakData {
  streak: number
  bestStreak: number
  profile: UserProfile | null
  loading: boolean
  refresh: () => void
}

export function useStreak(): StreakData {
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  const refresh = () => setTick(t => t + 1)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const [profileRes, relapseRes] = await Promise.all([
          supabase
            .from('users_profile')
            .select('*')
            .eq('id', user.id)
            .single(),
          supabase
            .from('craving_logs')
            .select('logged_at')
            .eq('user_id', user.id)
            .eq('outcome', 'relapsed')
            .order('logged_at', { ascending: true }),
        ])

        if (profileRes.data) {
          setProfile(profileRes.data as UserProfile)
          setBestStreak(profileRes.data.best_streak)

          const current = calculateStreak(
            new Date(profileRes.data.start_date),
            relapseRes.data ?? []
          )
          setStreak(current)

          // Update best_streak if needed
          if (current > profileRes.data.best_streak) {
            await supabase
              .from('users_profile')
              .update({ best_streak: current })
              .eq('id', user.id)
            setBestStreak(current)
          }
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [tick])

  return { streak, bestStreak, profile, loading, refresh }
}
