import { useState, useEffect, useRef } from 'react'

const REPLACEMENTS = [
  { icon: 'ti-walk', text: 'Đi bộ 5 phút' },
  { icon: 'ti-droplet', text: 'Uống một ly nước' },
  { icon: 'ti-music', text: 'Nghe nhạc yêu thích' },
  { icon: 'ti-phone', text: 'Gọi cho bạn bè' },
  { icon: 'ti-pencil', text: 'Viết ra cảm xúc' },
  { icon: 'ti-wind', text: 'Hít thở 4-7-8' },
]

interface Props {
  onOvercome: () => void
  onRelapse: () => void
  onClose: () => void
}

export function UrgeSurfer({ onOvercome, onRelapse, onClose }: Props) {
  const [seconds, setSeconds] = useState(600)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current!)
          onOvercome()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current!)
  }, [])

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const progress = (seconds / 600) * 100

  return (
    <div style={{
      background: 'var(--color-warning-bg)',
      border: '0.5px solid var(--color-warning-border)',
      borderRadius: 12,
      padding: 24,
      textAlign: 'center',
      marginBottom: 16,
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: 'var(--color-accent-bg)', border: '2px solid var(--color-accent-border)',
        margin: '0 auto 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, color: 'var(--color-accent)',
        animation: 'breathe 4s ease-in-out infinite',
      }}>thở</div>

      <style>{`@keyframes breathe { 0%,100%{transform:scale(1);opacity:.7} 50%{transform:scale(1.3);opacity:1} }`}</style>

      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
        Urge surfing — cơn thèm như sóng, nó sẽ qua
      </p>

      <div style={{ fontSize: 48, fontWeight: 500, lineHeight: 1, margin: '16px 0 8px' }}>
        {mins}:{secs < 10 ? '0' : ''}{secs}
      </div>

      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 16 }}>
        Hãy ngồi yên và quan sát cảm giác mà không phản ứng
      </p>

      <div style={{ height: 6, background: 'var(--color-border)', borderRadius: 3, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{
          height: '100%', background: 'var(--color-warning)',
          borderRadius: 3, width: `${progress}%`, transition: 'width 1s linear'
        }} />
      </div>

      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 12 }}>
        Trong lúc chờ, hãy thử:
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
        {REPLACEMENTS.map(r => (
          <div key={r.text} style={{
            padding: '10px 12px', background: 'var(--color-surface)',
            border: '0.5px solid var(--color-border)', borderRadius: 'var(--radius)',
            fontSize: 12, display: 'flex', alignItems: 'center', gap: 8,
            cursor: 'pointer', color: 'var(--color-text-secondary)',
          }}>
            <i className={`ti ${r.icon}`} style={{ fontSize: 16 }} aria-hidden />
            {r.text}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <button onClick={onOvercome} style={{
          padding: '8px 16px', border: '0.5px solid var(--color-border)',
          borderRadius: 'var(--radius)', background: 'var(--color-surface)',
          color: 'var(--color-text-secondary)', fontSize: 13,
        }}>Tôi đã vượt qua</button>
        <button onClick={onRelapse} style={{
          padding: '8px 16px', border: '0.5px solid var(--color-danger-border)',
          borderRadius: 'var(--radius)', background: 'transparent',
          color: 'var(--color-danger)', fontSize: 13,
        }}>Ghi nhận relapse</button>
      </div>
    </div>
  )
}
