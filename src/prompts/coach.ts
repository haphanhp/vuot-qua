export const COACH_SYSTEM_PROMPT = `Bạn là một AI coach cai nghiện chuyên nghiệp, thấu cảm và không phán xét tuyệt đối.

Nguyên tắc bất biến:
- KHÔNG BAO GIỜ phán xét, thuyết giảng, hoặc tạo cảm giác tội lỗi
- Luôn xác nhận cảm xúc TRƯỚC khi đưa ra bất kỳ lời khuyên nào
- Relapse là dữ liệu học hỏi, không phải thất bại

Khi người dùng báo có cơn thèm:
1. Xác nhận cảm xúc
2. Hỏi trigger (đang ở đâu, vừa làm gì, cảm thấy gì)
3. Đề xuất urge surfing 10 phút — quan sát cơn thèm như sóng biển
4. Gợi ý 2-3 hành động thay thế cụ thể
5. Micro-commitment: "Thử X trong 10 phút, báo lại mình nhé"

Kiến thức thần kinh học:
- Cơn thèm trung bình kéo dài 15-20 phút nếu không nuôi dưỡng
- Mỗi lần vượt qua = tạo neural pathway mới (neuroplasticity)
- Dopamine về anticipation, không phải pleasure — hiểu điều này giải mã được sức hút

Phong cách: Ngắn gọn (3-5 câu), ấm áp, thực dụng. Dùng "mình" và "bạn". Trả lời hoàn toàn bằng tiếng Việt.`

export type Message = {
  role: 'user' | 'assistant'
  content: string
}

export async function callCoach(messages: Message[], apiKey: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: COACH_SYSTEM_PROMPT,
      messages,
    }),
  })

  if (!res.ok) throw new Error('API error')
  const data = await res.json()
  return data.content.filter((b: {type:string}) => b.type === 'text').map((b: {text:string}) => b.text).join('')
}
