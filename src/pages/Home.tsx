import { useState } from 'react'
import { supabase, type Profile } from '../lib/supabase'
import { UrgeSurfer } from '../components/UrgeSurfer'
import { updateStreak } from '../lib/streak'

const TRIGGERS = ['Căng thẳng','Buồn chán','Cô đơn','Mệt mỏi','Xung đột','Áp lực xã hội','Sau ăn','Môi trường']

const INFO_BOXES = [
  { icon: '🧠', text: 'Ghi chú cảm xúc mỗi ngày giúp não nhận diện pattern trigger — nghiên cứu cho thấy viết ra giảm 40% cường độ cơn thèm.' },
  { icon: '🌊', text: 'Cơn thèm như sóng biển — nó lên rồi tự xuống sau 15-20 phút nếu bạn không nuôi dưỡng nó.' },
  { icon: '🔁', text: 'Mỗi lần vượt qua cơn thèm = tạo neural pathway mới. Làm đủ nhiều lần, con đường cũ tự mờ đi.' },
]

export function Home({ profile, onRefresh }: { profile: Profile | null; onRefresh: () => void }) {
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
        user_id: profile.id, trigger: 'urge-surf', intensity: 5, outcome: 'overcame'
      })
      onRefresh()
    }
    showToast('Xuất sắc! Bạn đã vượt qua cơn thèm 💪')
  }

  const handleRelapse = async () => {
    setSurfing(false)
    if (profile) {
      await supabase.from('craving_logs').insert({
        user_id: profile.id, trigger: 'relapse', intensity: 10, outcome: 'relapse'
      })
      await updateStreak(profile.id)
      onRefresh()
    }
    showToast('Đã ghi nhận. Relapse là dữ liệu, không phải thất bại.', 'info')
  }

  const saveNote = async () => {
    if (!note.trim()) {
      showToast('Hãy viết gì đó trước khi lưu', 'info')
      return
    }
    setSaving(true)
    try {
      if (profile) {
        await supabase.from('daily_notes').insert({ user_id: profile.id, content: note })
      } else {
        // Lưu local nếu chưa login
        const existing = JSON.parse(localStorage.getItem('daily_notes') || '[]')
        existing.unshift({ content: note, created_at: new Date().toISOString() })
        localStorage.setItem('daily_notes', JSON.stringify(existing.slice(0, 30)))
      }
      setNote('')
      showToast('Ghi chú đã được lưu ✓')
    } catch {
      showToast('Lỗi khi lưu, thử lại sau', 'info')
    } finally {
      setSaving(false)
    }
  }

  const toastBg = toast?.type === 'success'
    ? { bg: 'var(--color-success-bg)', border: 'var(--color-success-border)', color: 'var(--color-success)' }
    : { bg: 'var(--color-warning-bg)', border: 'var(--color-warning-border)', color: 'var(--color-warning)' }

  return (
    <div style={{ padding: 24 }}>
      {/* Toast notification */}
      {toast && (
        <div style={{
          position: 'fixed', top: 16, right: 16, zIndex: 100,
          background: toastBg.bg, border: `0.5px solid ${toastBg.border}`,
          color: toastBg.color, padding: '12px 18px', borderRadius: 10,
          fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          animation: 'fadeIn 0.2s ease',
        }}>
          <i className={`ti ${toast.type === 'success' ? 'ti-check' : 'ti-info-circle'}`} aria-hidden />
          {toast.msg}
        </div>
      )}
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        {[
          { val: profile?.current_streak ?? 0, label: 'ngày streak hiện tại', icon: '🔥' },
          { val: profile?.best_streak ?? 0, label: 'kỷ lục cá nhân', icon: '🏆' },
        ].map(m => (
          <div key={m.label} style={{
            background: 'var(--color-surface)', border: '0.5px solid var(--color-border)',
            borderRadius: 10, padding: 16,
          }}>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 6 }}>{m.icon} {m.label}</div>
            <div style={{ fontSize: 28, fontWeight: 500 }}>{m.val}</div>
          </div>
        ))}
      </div>

      {/* Craving button / Urge surf */}
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

      {/* Info boxes — giải thích cơ chế */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {INFO_BOXES.map(b => (
          <div key={b.icon} style={{
            display: 'flex', gap: 10, alignItems: 'flex-start',
            background: 'var(--color-surface)', border: '0.5px solid var(--color-border)',
            borderRadius: 10, padding: '12px 14px',
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{b.icon}</span>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>{b.text}</p>
          </div>
        ))}
      </div>

      {/* Trigger thường gặp */}
      <div style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Trigger thường gặp của bạn
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {TRIGGERS.map(t => (
            <span key={t} style={{
              padding: '4px 10px', background: 'var(--color-warning-bg)',
              color: 'var(--color-warning)', borderRadius: 99, fontSize: 12,
            }}>{t}</span>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 10, lineHeight: 1.5 }}>
          Nhận ra trigger giúp não không bị bất ngờ — khi biết trước, bạn có thể chuẩn bị hành động thay thế.
        </p>
      </div>

      {/* Ghi chú hôm nay */}
      <div style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', borderRadius: 10, padding: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Ghi chú hôm nay
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 10, lineHeight: 1.5 }}>
          Viết bất cứ điều gì bạn đang cảm thấy. Nghiên cứu cho thấy ghi ra giảm 40% cường độ cơn thèm.
        </p>
        <textarea
          value={note} onChange={e => setNote(e.target.value)}
          placeholder="Hôm nay tôi cảm thấy... / Điều khó khăn nhất lúc này là..."
          style={{
            width: '100%', background: 'var(--color-surface-2)',
            border: '0.5px solid var(--color-border)', borderRadius: 8,
            padding: 10, fontSize: 13, color: 'var(--color-text)',
            resize: 'none', height: 90, outline: 'none', lineHeight: 1.6,
          }}
          onFocus={e => e.target.style.borderColor = 'var(--color-accent-border)'}
          onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
        />
        <button
          onClick={saveNote}
          disabled={saving || !note.trim()}
          style={{
            marginTop: 10, padding: '9px 18px',
            border: 'none', borderRadius: 8,
            background: saving || !note.trim() ? 'var(--color-surface-2)' : 'var(--color-accent)',
            color: saving || !note.trim() ? 'var(--color-text-muted)' : 'white',
            fontSize: 13, fontWeight: 500, cursor: saving || !note.trim() ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {saving ? 'Đang lưu...' : 'Lưu ghi chú'}
        </button>
      </div>
    </div>
  )
}
