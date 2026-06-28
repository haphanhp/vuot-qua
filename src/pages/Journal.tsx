import { useState } from 'react'
import { supabase, type Profile } from '../lib/supabase'

const TRIGGERS = ['Căng thẳng','Buồn chán','Cô đơn','Mệt mỏi','Xung đột','Áp lực XH','Sau ăn','Môi trường','Khác']

export function Journal({ profile }: { profile: Profile | null }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [intensity, setIntensity] = useState(5)
  const [note, setNote] = useState('')
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const log = async () => {
    if (!profile) return
    await supabase.from('craving_logs').insert({
      user_id: profile.id,
      trigger: selected || 'Không rõ',
      intensity,
      note: note || null,
      outcome: 'in_progress',
    })
    setSelected(null)
    setIntensity(5)
    setNote('')
    showToast('Trigger đã được ghi lại')
  }

  return (
    <div style={{ padding: 24 }}>
      {toast && (
        <div style={{
          position: 'fixed', top: 16, right: 16, zIndex: 100,
          background: 'var(--color-success-bg)', border: '0.5px solid var(--color-success-border)',
          color: 'var(--color-success)', padding: '10px 16px', borderRadius: 'var(--radius)', fontSize: 13,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <i className="ti ti-check" aria-hidden /> {toast}
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 500 }}>Nhật ký trigger</h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>Ghi lại ngay khi có cơn thèm để nhận ra pattern</p>
      </div>

      <div style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Trigger lúc này là gì?
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 20 }}>
          {TRIGGERS.map(t => (
            <div key={t} onClick={() => setSelected(t === selected ? null : t)} style={{
              padding: '8px 12px', borderRadius: 'var(--radius)', fontSize: 12, cursor: 'pointer', textAlign: 'center',
              background: selected === t ? 'var(--color-accent-bg)' : 'var(--color-surface-2)',
              border: `0.5px solid ${selected === t ? 'var(--color-accent-border)' : 'var(--color-border)'}`,
              color: selected === t ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            }}>{t}</div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <label style={{ fontSize: 13, color: 'var(--color-text-secondary)', width: 80 }}>Cường độ</label>
          <input type="range" min={1} max={10} value={intensity} onChange={e => setIntensity(+e.target.value)} style={{ flex: 1 }} />
          <span style={{ fontSize: 13, fontWeight: 500, width: 30, textAlign: 'right' }}>{intensity}</span>
        </div>

        <textarea
          value={note} onChange={e => setNote(e.target.value)}
          placeholder="Bạn đang ở đâu, làm gì, cảm thấy gì ngay lúc này?"
          style={{
            width: '100%', background: 'var(--color-surface-2)', border: '0.5px solid var(--color-border)',
            borderRadius: 'var(--radius)', padding: 10, fontSize: 13, color: 'var(--color-text)',
            resize: 'none', height: 80, outline: 'none', marginBottom: 16,
          }}
        />

        <button onClick={log} style={{
          width: '100%', padding: 12, background: 'var(--color-accent)',
          color: 'white', border: 'none', borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 500,
        }}>Ghi lại trigger này</button>
      </div>
    </div>
  )
}
