import { useState } from 'react'
import { supabase, type Profile } from '../lib/supabase'
import { useLang } from '../i18n/LangContext'

export function Journal({ profile }: { profile: Profile | null }) {
  const { t } = useLang()
  const TRIGGERS = [t.stress, t.boredom, t.lonely, t.tired, t.conflict, t.socialPressure, t.afterEating, t.environment, t.other]
  const [selected, setSelected] = useState<string | null>(null)
  const [intensity, setIntensity] = useState(5)
  const [note, setNote] = useState('')
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const log = async () => {
    if (profile) {
      await supabase.from('craving_logs').insert({
        user_id: profile.id, trigger: selected || t.other,
        intensity, note: note || null, outcome: 'in_progress',
      })
    }
    setSelected(null); setIntensity(5); setNote('')
    showToast(t.triggerLogged)
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
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 500 }}>{t.journalTitle}</h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>{t.journalSubtitle}</p>
      </div>
      <div style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {t.whatTrigger}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 20 }}>
          {TRIGGERS.map(tr => (
            <div key={tr} onClick={() => setSelected(tr === selected ? null : tr)} style={{
              padding: '8px 12px', borderRadius: 'var(--radius)', fontSize: 12, cursor: 'pointer', textAlign: 'center',
              background: selected === tr ? 'var(--color-accent-bg)' : 'var(--color-surface-2)',
              border: `0.5px solid ${selected === tr ? 'var(--color-accent-border)' : 'var(--color-border)'}`,
              color: selected === tr ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            }}>{tr}</div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <label style={{ fontSize: 13, color: 'var(--color-text-secondary)', width: 80 }}>{t.intensity}</label>
          <input type="range" min={1} max={10} value={intensity} onChange={e => setIntensity(+e.target.value)} style={{ flex: 1 }} />
          <span style={{ fontSize: 13, fontWeight: 500, width: 30, textAlign: 'right' }}>{intensity}</span>
        </div>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder={t.journalNotePlaceholder}
          style={{ width: '100%', background: 'var(--color-surface-2)', border: '0.5px solid var(--color-border)', borderRadius: 'var(--radius)', padding: 10, fontSize: 13, color: 'var(--color-text)', resize: 'none', height: 80, outline: 'none', marginBottom: 16 }} />
        <button onClick={log} style={{ width: '100%', padding: 12, background: 'var(--color-accent)', color: 'white', border: 'none', borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 500 }}>
          {t.logTrigger}
        </button>
      </div>
    </div>
  )
}
