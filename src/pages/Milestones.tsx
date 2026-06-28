import { MILESTONES } from '../lib/streak'
import type { Profile } from '../lib/supabase'

export function Milestones({ profile }: { profile: Profile | null }) {
  const current = profile?.current_streak ?? 0

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 500 }}>Cột mốc</h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>Dopamine thay thế lành mạnh — mỗi ngày đều đáng ăn mừng</p>
      </div>

      {MILESTONES.map(m => {
        const done = current >= m.days
        const daysLeft = m.days - current
        return (
          <div key={m.days} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px',
            borderRadius: 'var(--radius)', marginBottom: 8, border: '0.5px solid var(--color-border)',
            background: done ? 'var(--color-success-bg)' : 'var(--color-surface)',
          }}>
            <div style={{ fontSize: 20 }}>{m.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{m.label}</div>
              <div style={{ fontSize: 12, marginTop: 2, color: done ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                {done ? `Đã đạt • ${m.science}` : `Còn ${daysLeft} ngày • ${m.science}`}
              </div>
            </div>
            {done
              ? <i className="ti ti-circle-check" style={{ color: 'var(--color-success)', fontSize: 18 }} aria-hidden />
              : <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{daysLeft} ngày nữa</span>
            }
          </div>
        )
      })}
    </div>
  )
}
