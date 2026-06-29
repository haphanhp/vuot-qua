# Vượt Qua 🌱

App cai nghiện với AI coach, xây dựng dựa trên cơ chế tâm lý học nghiện thật sự.

## Cơ chế tâm lý được implement

| Điểm can thiệp | Cơ chế | Feature |
|---|---|---|
| **Cue** | Nhận diện trigger | Journal trigger, phân loại 9 loại |
| **Craving** | Urge surfing | Timer 10 phút + breathing animation |
| **Routine** | Hành vi thay thế | 6 gợi ý thay thế cụ thể |
| **Reward** | Dopamine lành mạnh | Streak + 7 milestones có giải thích khoa học |

## Setup nhanh

```bash
npm install
cp .env.example .env
# Điền VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_ANTHROPIC_API_KEY
npm run dev
```

## Supabase
1. Tạo project tại supabase.com
2. Paste nội dung `supabase/migrations/001_init.sql` vào SQL Editor
3. Lấy URL và anon key từ Settings > API

## Anthropic API Key
Lấy tại console.anthropic.com > API Keys
