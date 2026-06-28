import { NavLink } from 'react-router-dom'
import type { Profile } from '../lib/supabase'

const NAV = [
  { to: '/', icon: 'ti-home', label: 'Tổng quan' },
  { to: '/coach', icon: 'ti-message-circle', label: 'AI Coach' },
  { to: '/journal', icon: 'ti-notebook', label: 'Nhật ký trigger' },
  { to: '/history', icon: 'ti-history', label: 'Lịch sử' },
  { to: '/milestones', icon: 'ti-trophy', label: 'Cột mốc' },
]

export function Sidebar({ profile }: { profile: Profile | null }) {
  return (
    <aside style={{
      width: 220, background: 'var(--color-surface)',
      borderRight: '0.5px solid var(--color-border)',
      display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100vh',
    }}>
      <div style={{ padding: '20px 16px 12px' }}>
        <h1 style={{ fontSize: 16, fontWeight: 500 }}>Vượt Qua</h1>
        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>AI recovery coach</p>
      </div>

      <div style={{
        margin: '0 12px 12px',
        background: 'var(--color-surface-2)',
        border: '0.5px solid var(--color-border)',
        borderRadius: 12, padding: 14, textAlign: 'center',
      }}>
        <div style={{ fontSize: 32, fontWeight: 500, lineHeight: 1 }}>
          {profile?.current_streak ?? 0}
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>ngày sạch</div>
      </div>

      <nav style={{ flex: 1, padding: '0 8px' }}>
        {NAV.map(n => (
          <NavLink key={n.to} to={n.to} end={n.to === '/'} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', borderRadius: 'var(--radius)',
            fontSize: 13, marginBottom: 2,
            color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            background: isActive ? 'var(--color-accent-bg)' : 'transparent',
            textDecoration: 'none',
          })}>
            <i className={`ti ${n.icon}`} style={{ fontSize: 16 }} aria-hidden />
            {n.label}
          </NavLink>
        ))}
      </nav>

      {profile && (
        <div style={{ padding: '12px 16px', borderTop: '0.5px solid var(--color-border)', fontSize: 12, color: 'var(--color-text-muted)' }}>
          {profile.display_name || profile.email}
        </div>
      )}
    </aside>
  )
}
