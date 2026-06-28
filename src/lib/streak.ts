import { supabase } from './supabase'

// Tính số ngày từ start_date đến hôm nay, trừ ngày có relapse
export function calcStreak(startDate: string, relapses: string[]): number {
  const start = new Date(startDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Tìm ngày relapse gần nhất
  const relapseDates = relapses
    .map(d => { const dt = new Date(d); dt.setHours(0,0,0,0); return dt })
    .sort((a, b) => b.getTime() - a.getTime())

  const lastRelapse = relapseDates[0]

  const from = lastRelapse && lastRelapse >= start ? lastRelapse : start
  const diffMs = today.getTime() - from.getTime()
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))
}

export async function updateStreak(userId: string) {
  // Lấy profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('start_date, best_streak')
    .eq('id', userId)
    .single()

  if (!profile) return

  // Lấy ngày relapse
  const { data: relapses } = await supabase
    .from('craving_logs')
    .select('created_at')
    .eq('user_id', userId)
    .eq('outcome', 'relapse')

  const relapseDates = (relapses || []).map(r => r.created_at)
  const current = calcStreak(profile.start_date, relapseDates)
  const best = Math.max(current, profile.best_streak || 0)

  await supabase
    .from('profiles')
    .update({ current_streak: current, best_streak: best })
    .eq('id', userId)

  return { current, best }
}

export function formatStreak(days: number): string {
  if (days === 0) return 'Bắt đầu hôm nay'
  if (days === 1) return '1 ngày'
  return `${days} ngày`
}

export const MILESTONES = [
  { days: 1,  emoji: '🌱', label: '1 ngày sạch',   science: 'Bước đầu tiên — não bắt đầu giảm cortisol' },
  { days: 3,  emoji: '🌿', label: '3 ngày sạch',   science: 'Đỉnh withdrawal thường đã qua' },
  { days: 7,  emoji: '🔥', label: '1 tuần sạch',   science: 'Dopamine receptor bắt đầu tái cân bằng' },
  { days: 14, emoji: '🌳', label: '2 tuần sạch',   science: 'Prefrontal cortex phục hồi kiểm soát xung động' },
  { days: 30, emoji: '🏔️', label: '1 tháng sạch',  science: 'Receptor dopamine bình thường hóa đáng kể' },
  { days: 60, emoji: '💪', label: '2 tháng sạch',  science: 'Cảm xúc ổn định hơn, giấc ngủ cải thiện' },
  { days: 90, emoji: '💎', label: '3 tháng sạch',  science: 'Myelin hóa lại neural pathway — thói quen mới củng cố' },
]
