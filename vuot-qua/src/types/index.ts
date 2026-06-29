// src/types/index.ts

export type AddictionType =
  | 'alcohol'
  | 'nicotine'
  | 'gambling'
  | 'social_media'
  | 'substance'
  | 'food'
  | 'other'

export type TriggerType =
  | 'stress'
  | 'boredom'
  | 'loneliness'
  | 'fatigue'
  | 'conflict'
  | 'environment'
  | 'after_meal'
  | 'social_pressure'
  | 'other'

export type ActionTaken =
  | 'urge_surf'
  | 'replacement_behavior'
  | 'chat_coach'
  | 'called_someone'
  | 'exercised'
  | 'relapsed'
  | 'other'

export type Outcome = 'overcame' | 'relapsed'

export interface UserProfile {
  id: string
  addiction_type: AddictionType | null
  start_date: string
  best_streak: number
  display_name: string | null
  created_at: string
  updated_at: string
}

export interface CravingLog {
  id: string
  user_id: string
  trigger_type: TriggerType | null
  intensity: number | null
  note: string | null
  action_taken: ActionTaken | null
  outcome: Outcome | null
  duration_minutes: number | null
  logged_at: string
}

export interface DailyNote {
  id: string
  user_id: string
  content: string
  mood: number | null
  logged_at: string
}

export interface ChatMessage {
  id: string
  user_id: string
  role: 'user' | 'assistant'
  content: string
  session_id: string
  created_at: string
}

// UI-only types
export interface ChatMessageUI {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

export interface Milestone {
  days: number
  emoji: string
  title: string
  science: string
}

export const MILESTONES: Milestone[] = [
  { days: 1, emoji: '🌱', title: '1 ngày sạch', science: 'Bước đầu tiên — quyết tâm hình thành' },
  { days: 3, emoji: '🌿', title: '3 ngày sạch', science: 'Đỉnh withdrawal thể chất thường qua sau 72 giờ' },
  { days: 7, emoji: '🔥', title: '1 tuần sạch', science: 'Dopamine bắt đầu normalize, giấc ngủ cải thiện' },
  { days: 14, emoji: '🌳', title: '2 tuần sạch', science: 'Prefrontal cortex cải thiện khả năng kiểm soát xung động' },
  { days: 30, emoji: '🏔️', title: '30 ngày sạch', science: 'Dopamine receptor density phục hồi ~70%' },
  { days: 90, emoji: '💎', title: '90 ngày sạch', science: 'Neural pathway mới được myelin hóa — thói quen thật sự thay đổi' },
  { days: 180, emoji: '🌊', title: '6 tháng sạch', science: 'Cấu trúc não thay đổi bền vững, cơn thèm giảm rõ rệt' },
  { days: 365, emoji: '🦅', title: '1 năm sạch', science: 'Nguy cơ relapse giảm đáng kể, identity shift hoàn thành' },
]

export const TRIGGER_LABELS: Record<TriggerType, string> = {
  stress: 'Căng thẳng',
  boredom: 'Buồn chán',
  loneliness: 'Cô đơn',
  fatigue: 'Mệt mỏi',
  conflict: 'Xung đột',
  environment: 'Môi trường',
  after_meal: 'Sau bữa ăn',
  social_pressure: 'Áp lực XH',
  other: 'Khác',
}
