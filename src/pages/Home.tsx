import { useState } from 'react'
import { supabase, type Profile } from '../lib/supabase'
import { UrgeSurfer } from '../components/UrgeSurfer'
import { updateStreak } from '../lib/streak'

const TRIGGERS = ['Căng thẳng','Buồn chán','Cô đơn','Mệt mỏi','Xung đột','Áp lực xã hội','Sau ăn','Môi trường']

export function Home({ profile, onRefresh }: { profile: Profile | null; onRefresh: () => void }) {
  const [surfing, setSurfing] = useState(false)
  const [note, setNote] = useState('')
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleOvercome = async () => {
    setSurfing(false)
    if (!profile) return
    await supabase.from('craving_logs').insert({
      user_id: profile.id, trigger: 'urge-surf', intensity: 5, outcome: 'overcame'
    })
    showToast('Xuất sắc! Bạn đã vượt qua cơn thèm 💪')
    onRefresh()
  }

  const handleRelapse = async () => {
    setSurfing(false)
    if (!profile) return
    await supabase.from('craving_logs').insert({
      user_id: profile.id, trigger: 'relapse', intensity: 10, outcome: 'relapse'
    })
    await updateStreak(profile.id)
    showToast('Đã ghi nhận. Relapse là dữ liệu, không phải thất bại. Hãy nói chuyện với coach.')
    onRefresh()
  }

  const saveNote = async () => {
    if (!profile || !note.trim()) return
    await supabase.from('daily_notes').insert({ user_id: profile.id, content: note })
    setNote('')
    showToast('Ghi chú đã được lưu')
  }

  return (
    <div style={{ padding: 24 }}>
      {toast && (
        <div style={{
          position: 'fixed', top: 16, right: 16, zIndex: 100,
          background: 'var(--color-success-bg)', border: '0.5px solid var(--color-success-border)',
          color: 'var(--color-success)', padding: '10px 16px', borderRadius: 'var(--radius)',
          fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <i className="ti ti-check" aria-hidden /> {toast}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { val: profile?.current_streak ?? 0, label: 'ngày streak hiện tại' },
          { val: profile?.best_streak ?? 0, label: 'kỷ lục cá nhân' },
        ].map(m => (
          <div key={m.label} style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', borderRadius: 'var(--radius)', padding: 14 }}>
            <div style={{ fontSize: 24, fontWeight: 500 }}>{m.val}</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {!surfing ? (
        <button onClick={() => setSurfing(true)} style={{
          width: '100%', padding: 16,
          background: 'var(--color-danger-bg)', border: '1.5px solid var(--color-danger-border)',
          borderRadius: 12, color: 'var(--color-danger)',
          fontSize: 15, fontWeight: 500, marginBottom: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          <i className="ti ti-alert-triangle" style={{ fontSize: 20 }} aria-hidden />
          Tôi đang có cơn thèm
        </button>
      ) : (
        <UrgeSurfer onOvercome={handleOvercome} onRelapse={handleRelapse} onClose={() => setSurfing(false)} />
      )}

      <div style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Trigger thường gặp
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {TRIGGERS.map(t => (
            <span key={t} style={{
              padding: '4px 10px', background: 'var(--color-warning-bg)',
              color: 'var(--color-warning)', borderRadius: 99, fontSize: 12,
            }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', borderRadius: 12, padding: 20, marginTop: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Ghi chú hôm nay
        </div>
        <textarea
          value={note} onChange={e => setNote(e.target.value)}
          placeholder="Bạn cảm thấy thế nào hôm nay?"
          style={{
            width: '100%', background: 'var(--color-surface-2)',
            border: '0.5px solid var(--color-border)', borderRadius: 'var(--radius)',
            padding: 10, fontSize: 13, color: 'var(--color-text)',
            resize: 'none', height: 80, outline: 'none',
          }}
        />
        <button onClick={saveNote} style={{
          marginTop: 8, padding: '8px 14px',
          border: '0.5px solid var(--color-border)', borderRadius: 'var(--radius)',
          background: 'var(--color-surface-2)', color: 'var(--color-text-secondary)', fontSize: 13,
        }}>Lưu ghi chú</button>
      </div>
    </div>
  )
}
