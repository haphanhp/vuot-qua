import { supabase } from './supabase'

export function calcStreak(startDate: string, relapses: string[]): number {
  const start = new Date(startDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const relapseDates = relapses
    .map(d => { const dt = new Date(d); dt.setHours(0,0,0,0); return dt })
    .sort((a, b) => b.getTime() - a.getTime())

  const lastRelapse = relapseDates[0]
  const from = lastRelapse && lastRelapse >= start ? lastRelapse : start
  const diffMs = today.getTime() - from.getTime()
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))
}

export async function updateStreak(userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('start_date, best_streak')
    .eq('id', userId)
    .single()

  if (!profile) return

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

// science: thuần Việt, không dùng từ kỹ thuật tiếng Anh
export const MILESTONES = [
  { days: 1,  emoji: '🌱', label: '1 ngày sạch',   science: 'Bước đầu tiên — não bắt đầu giảm mức độ căng thẳng' },
  { days: 3,  emoji: '🌿', label: '3 ngày sạch',   science: 'Giai đoạn khó chịu nhất thường đã qua' },
  { days: 7,  emoji: '🔥', label: '1 tuần sạch',   science: 'Cảm giác thèm bắt đầu giảm rõ rệt, giấc ngủ cải thiện' },
  { days: 14, emoji: '🌳', label: '2 tuần sạch',   science: 'Vùng não kiểm soát quyết định đang dần phục hồi' },
  { days: 30, emoji: '🏔️', label: '1 tháng sạch',  science: 'Cảm xúc ổn định hơn, cảm giác thèm giảm mạnh' },
  { days: 60, emoji: '💪', label: '2 tháng sạch',  science: 'Thói quen mới đang được củng cố trong não' },
  { days: 90, emoji: '💎', label: '3 tháng sạch',  science: 'Đường dẫn thần kinh mới đã vững chắc — đây là nền tảng lâu dài' },
]
