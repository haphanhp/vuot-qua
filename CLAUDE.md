# Vượt Qua — Addiction Recovery App

## Mục tiêu
App cai nghiện dựa trên cơ chế habit loop (Cue→Craving→Routine→Reward). AI coach tích hợp Claude API.

## Stack
- **Frontend**: React 18 + TypeScript + Vite + React Router v6
- **Backend**: Supabase (auth + PostgreSQL + RLS)
- **AI**: Claude claude-sonnet-4-6 API (direct từ client, key trong .env)
- **Icons**: Tabler Icons webfont (CDN)

## Cấu trúc thư mục
```
src/
├── pages/
│   ├── Auth.tsx         -- login/signup
│   ├── Home.tsx         -- dashboard + craving button + urge surf timer
│   ├── Coach.tsx        -- Claude chat interface
│   ├── Journal.tsx      -- trigger logging
│   ├── History.tsx      -- craving log history
│   └── Milestones.tsx   -- gamification với khoa học thần kinh
├── components/
│   ├── Sidebar.tsx      -- navigation + streak display
│   └── UrgeSurfer.tsx   -- countdown 10 phút + breathing animation
├── hooks/
│   ├── useAuth.ts       -- Supabase auth state
│   └── useProfile.ts    -- user profile + streak
├── lib/
│   ├── supabase.ts      -- Supabase client + types
│   └── streak.ts        -- streak calculation + MILESTONES constants
└── prompts/
    └── coach.ts         -- AI system prompt + callCoach() helper
```

## Env variables cần có
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_ANTHROPIC_API_KEY=
```

## Database schema
Xem: supabase/migrations/001_init.sql
- profiles: id, email, display_name, addiction_type, start_date, current_streak, best_streak
- craving_logs: user_id, trigger, intensity(1-10), note, outcome(overcame|relapse|in_progress)
- chat_messages: user_id, role(user|assistant), content
- daily_notes: user_id, content

## Quy tắc tuyệt đối khi sửa code
- KHÔNG dùng ngôn ngữ shame-based trong bất kỳ UI text nào
- Streak reset chỉ khi user tự báo relapse — KHÔNG auto-detect
- Craving log luôn neutral (không label là "thất bại")
- System prompt trong src/prompts/coach.ts: chỉ sửa kỹ thuật, KHÔNG thay đổi tone không phán xét
- API key Anthropic phải qua env, KHÔNG hardcode

## Để chạy dev
```bash
npm install
cp .env.example .env   # điền keys
npm run dev
```

## Để deploy Supabase
```bash
npx supabase db push   # hoặc paste SQL vào Supabase dashboard
```
