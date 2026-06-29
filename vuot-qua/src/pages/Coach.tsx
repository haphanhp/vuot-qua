import { useState, useRef, useEffect } from 'react'
import { supabase, type Profile } from '../lib/supabase'
import { callCoach, type Message } from '../prompts/coach'
import { useLang } from '../i18n/LangContext'

export function Coach({ profile }: { profile: Profile | null }) {
  const { t } = useLang()
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t.coachWelcome }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input.trim() }
    const newHistory = [...messages, userMsg]
    setMessages(newHistory)
    setInput('')
    setLoading(true)

    try {
      const reply = await callCoach(newHistory, apiKey)
      const assistantMsg: Message = { role: 'assistant', content: reply }
      setMessages([...newHistory, assistantMsg])
      if (profile) {
        await supabase.from('chat_messages').insert([
          { user_id: profile.id, role: 'user', content: userMsg.content },
          { user_id: profile.id, role: 'assistant', content: reply },
        ])
      }
    } catch {
      setMessages([...newHistory, { role: 'assistant', content: t.coachError }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 24, height: 'calc(100vh - 57px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 500 }}>{t.coachTitle}</h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>{t.coachSubtitle}</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start',
            flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: m.role === 'assistant' ? 'var(--color-accent-bg)' : 'var(--color-surface-2)',
              border: m.role === 'user' ? '0.5px solid var(--color-border)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 500,
              color: m.role === 'assistant' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            }}>
              {m.role === 'assistant' ? 'AI' : t.you[0]}
            </div>
            <div style={{
              maxWidth: '80%', padding: '10px 14px', fontSize: 14, lineHeight: 1.6,
              background: m.role === 'assistant' ? 'var(--color-surface)' : 'var(--color-accent-bg)',
              border: `0.5px solid ${m.role === 'assistant' ? 'var(--color-border)' : 'var(--color-accent-border)'}`,
              borderRadius: m.role === 'assistant' ? '14px 14px 14px 4px' : '14px 14px 4px 14px',
              whiteSpace: 'pre-wrap',
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--color-accent)' }}>AI</div>
            <div style={{ padding: '14px 18px', background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', borderRadius: '14px 14px 14px 4px' }}>
              <span style={{ display: 'flex', gap: 4 }}>
                {[0,1,2].map(i => <span key={i} style={{ width:6,height:6,borderRadius:'50%',background:'var(--color-text-muted)',display:'inline-block',animation:`dot 1.2s ${i*0.2}s ease-in-out infinite` }} />)}
              </span>
              <style>{`@keyframes dot{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-5px);opacity:1}}`}</style>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '0.5px solid var(--color-border)' }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder={t.coachPlaceholder}
          style={{
            flex: 1, background: 'var(--color-surface-2)', border: '0.5px solid var(--color-border)',
            borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: 14,
            color: 'var(--color-text)', outline: 'none',
          }}
        />
        <button onClick={send} disabled={loading} style={{
          background: 'var(--color-accent-bg)', border: '0.5px solid var(--color-accent-border)',
          borderRadius: 'var(--radius)', padding: '10px 16px', color: 'var(--color-accent)',
          fontSize: 14, fontWeight: 500, cursor: 'pointer',
        }}>{t.send}</button>
      </div>
    </div>
  )
}
