// supabase/functions/chat/index.ts
// Deploy: npx supabase functions deploy chat
// Secret: npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const COACH_SYSTEM_PROMPT = `
Bạn là AI coach cai nghiện chuyên nghiệp — thấu cảm, ấm áp, không phán xét tuyệt đối.

PHƯƠNG PHÁP CỐT LÕI:
- Motivational Interviewing: câu hỏi mở, phản chiếu cảm xúc, khẳng định quyền tự quyết
- Urge Surfing: gợi ý quan sát cơn thèm 10 phút không hành động (sóng sẽ tự qua)
- Neuroplasticity: mỗi ngày sạch tạo neural pathway mới trong não

KHI NGƯỜI DÙNG BÁO CÓ CRAVING:
1. Xác nhận cảm xúc trước ("Mình hiểu cảm giác đó rất thật và rất mạnh")
2. Hỏi trigger ("Điều gì đang xảy ra ngay lúc này với bạn?")
3. Đề xuất urge surfing + 2 hành động thay thế cụ thể phù hợp context
4. Đặt micro-commitment ("Thử 10 phút làm X, rồi báo lại cho mình nhé")

KHI NGƯỜI DÙNG BÁO RELAPSE:
1. TUYỆT ĐỐI không phán xét, không tạo cảm giác tội lỗi
2. "Relapse là dữ liệu quý giá, không phải thất bại"
3. Hỏi "Điều gì đã xảy ra ngay trước đó?" — phân tích trigger để học
4. Lập kế hoạch phòng ngừa cụ thể cho trigger đó

QUY TẮC TUYỆT ĐỐI:
- KHÔNG thuyết giảng hay đưa ra cảnh báo sức khỏe dài dòng
- KHÔNG dùng: "thất bại", "yếu đuối", "sao lại như vậy"
- KHÔNG tạo áp lực về streak
- Trả lời ngắn gọn (3-5 câu), ấm áp, thực dụng
- Trả lời bằng tiếng Việt
`

const RATE_LIMIT = 50 // messages per user per day

serve(async (req: Request) => {
  // CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    // Auth check
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return new Response('Unauthorized', { status: 401 })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return new Response('Unauthorized', { status: 401 })

    // Rate limit check — đếm messages hôm nay
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count } = await supabase
      .from('chat_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('role', 'user')
      .gte('created_at', today.toISOString())

    if ((count ?? 0) >= RATE_LIMIT) {
      return new Response(
        JSON.stringify({ error: 'Đã đạt giới hạn 50 tin nhắn hôm nay. Thử lại ngày mai.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Parse request
    const { messages, session_id } = await req.json() as {
      messages: Array<{ role: 'user' | 'assistant'; content: string }>
      session_id: string
    }

    // Lấy 10 messages cuối để dùng làm context
    const contextMessages = messages.slice(-10)

    // Gọi Claude API
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system: COACH_SYSTEM_PROMPT,
        messages: contextMessages,
      }),
    })

    if (!claudeRes.ok) {
      throw new Error(`Claude API error: ${claudeRes.status}`)
    }

    const claudeData = await claudeRes.json()
    const reply = claudeData.content
      ?.filter((b: { type: string }) => b.type === 'text')
      .map((b: { text: string }) => b.text)
      .join('') ?? ''

    // Lưu vào chat_history
    const lastUserMsg = messages[messages.length - 1]
    await supabase.from('chat_history').insert([
      { user_id: user.id, role: 'user', content: lastUserMsg.content, session_id },
      { user_id: user.id, role: 'assistant', content: reply, session_id },
    ])

    return new Response(
      JSON.stringify({ reply }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (err) {
    console.error('Edge function error:', err)
    return new Response(
      JSON.stringify({ error: 'Lỗi kết nối AI coach. Thử lại sau.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
