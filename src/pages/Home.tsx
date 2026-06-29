import { useState } from 'react'
import { supabase, type Profile } from '../lib/supabase'
import { UrgeSurfer } from '../components/UrgeSurfer'
import { updateStreak } from '../lib/streak'
import { useLang } from '../i18n/LangContext'

export function Home({ profile, onRefresh }: { profile: Profile | null; onRefresh: () => void }) {
  const { t } = useLang()
  const [surfing, setSurfing] = useState(false)
  const [note, setNote] = useState('')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' } | null>(null)
  const [saving, setSaving] = useState(false)

  const showToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handleOvercome = async () => {
    setSurfing(false)
    if (profile) {
      await supabase.from('craving_logs').insert({
        user_id: profile.id, trigger: 'vuot-song', intensity: 5, outcome: 'overcame'
      })
      onRefresh()
    }
    showToast(t.overcameToast)
  }

  const handleRelapse = async () => {
    setSurfing(false)
    if (profile) {
      await supabase.from('craving_logs').insert({
        user_id: profile.id, trigger: 'tai-nghien', intensity: 10, outcome: 'relapse'
      })
      await updateStreak(profile.id)
      onRefresh()
    }
    showToast(t.relapseToast, 'info')
  }

  const saveNote = async () => {
    if (!note.trim()) { showToast(t.noteEmpty, 'info'); return }
    setSaving(true)
    try {
      if (profile) {
        await supabase.from('daily_notes').insert({ user_id: profile.id, content: note })
      } else {
        const existing = JSON.parse(localStorage.getItem('daily_notes') || '[]')
        existing.unshift({ content: note, created_at: new Date().toISOString() })
        localStorage.setItem('daily_notes', JSON.stringify(existing.slice(0, 30)))
      }
      setNote('')
      showToast(t.noteSaved)
    } catch {
      showToast('Lỗi khi lưu, thử lại sau', 'info')
    } finally {
      setSaving(false)
    }
  }

  const toastStyle = toast?.type === 'success'
    ? { bg: 'var(--color-success-bg)', border: 'var(--color-success-border)', color: 'var(--color-success)', icon: 'ti-check' }
    : { bg: 'var(--color-warning-bg)', border: 'var(--color-warning-border)', color: 'var(--color-warning)', icon: 'ti-info-circle' }

  const INFO = [
    { title: t.info1Title, body: t.info1 },
    { title: t.info2Title, body: t.info2 },
    { title: t.info3Title, body: t.info3 },
  ]

  return (
    <div style={{ padding: 24 }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 16, right: 16, zIndex: 100,
          background: toastStyle.bg, border: `0.5px solid ${toastStyle.border}`,
          color: toastStyle.color, padding: '12px 18px', borderRadius: 10,
          fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          animation: 'fadeIn 0.2s ease',
        }}>
          <i className={`ti ${toastStyle.icon}`} aria-hidden /> {toast.msg}
        </div>
      )}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Chỉ số */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        {[
          { val: profile?.current_streak ?? 0, label: t.currentStreak, icon: '🔥' },
          { val: profile?.best_streak ?? 0, label: t.bestRecord, icon: '🏆' },
        ].map(m => (
          <div key={m.label} style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 6 }}>{m.icon} {m.label}</div>
            <div style={{ fontSize: 28, fontWeight: 500 }}>{m.val} <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--color-text-muted)' }}>{t.streakDays}</span></div>
          </div>
        ))}
      </div>

      {/* Nút cơn thèm / Vượt sóng */}
      {!surfing ? (
        <button onClick={() => setSurfing(true)} style={{
          width: '100%', padding: 16,
          background: 'var(--color-danger-bg)', border: '1.5px solid var(--color-danger-border)',
          borderRadius: 12, color: 'var(--color-danger)',
          fontSize: 15, fontWeight: 500, marginBottom: 16,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        }}>
          <span>{t.iHaveCraving}</span>
          <span style={{ fontSize: 12, fontWeight: 400, opacity: 0.8 }}>{t.cravingSubtext}</span>
        </button>
      ) : (
        <UrgeSurfer onOvercome={handleOvercome} onRelapse={handleRelapse} onClose={() => setSurfing(false)} />
      )}

      {/* Giải thích cơ chế — thuần Việt */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {INFO.map(b => (
          <div key={b.title} style={{
            background: 'var(--color-surface)', border: '0.5px solid var(--color-border)',
            borderRadius: 10, padding: '12px 14px',
          }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{b.title}</div>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>{b.body}</p>
          </div>
        ))}
      </div>

      {/* Yếu tố kích hoạt thường gặp */}
      <div style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {t.commonTriggers}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[t.stress, t.boredom, t.lonely, t.tired, t.conflict, t.socialPressure, t.afterEating, t.environment].map(tr => (
            <span key={tr} style={{ padding: '4px 10px', background: 'var(--color-warning-bg)', color: 'var(--color-warning)', borderRadius: 99, fontSize: 12 }}>{tr}</span>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 10, lineHeight: 1.5 }}>{t.triggerHelp}</p>
      </div>

      {/* Ghi chú hôm nay */}
      <div style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', borderRadius: 10, padding: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {t.todayNote}
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 10, lineHeight: 1.5 }}>{t.noteHelp}</p>
        <textarea
          value={note} onChange={e => setNote(e.target.value)}
          placeholder={t.notePlaceholder}
          style={{
            width: '100%', background: 'var(--color-surface-2)',
            border: '0.5px solid var(--color-border)', borderRadius: 8,
            padding: 10, fontSize: 13, color: 'var(--color-text)',
            resize: 'none', height: 90, outline: 'none', lineHeight: 1.6,
          }}
          onFocus={e => e.target.style.borderColor = 'var(--color-accent-border)'}
          onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
        />
        <button onClick={saveNote} disabled={saving || !note.trim()} style={{
          marginTop: 10, padding: '9px 18px', border: 'none', borderRadius: 8,
          background: saving || !note.trim() ? 'var(--color-surface-2)' : 'var(--color-accent)',
          color: saving || !note.trim() ? 'var(--color-text-muted)' : 'white',
          fontSize: 13, fontWeight: 500,
          cursor: saving || !note.trim() ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s',
        }}>
          {saving ? t.saving : t.saveNote}
        </button>
      </div>
    </div>
  )
}
