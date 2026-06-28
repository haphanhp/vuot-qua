// src/components/Layout.tsx
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useStreak } from '@/hooks/useStreak'

const NAV = [
  { to: '/', label: 'Tổng quan', icon: '🏠' },
  { to: '/coach', label: 'AI Coach', icon: '💬' },
  { to: '/journal', label: 'Nhật ký trigger', icon: '📓' },
  { to: '/milestones', label: 'Cột mốc', icon: '🏆' },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth()
  const { streak } = useStreak()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/auth')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--surface-0)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '220px',
        background: 'var(--surface-1)',
        borderRight: '0.5px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        <div style={{ padding: '20px 16px 12px' }}>
          <h1 style={{ fontSize: '16px', fontWeight: 500 }}>Vượt qua</h1>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>AI recovery coach</p>
        </div>

        <div style={{ margin: '0 12px 12px', background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 500, lineHeight: 1 }}>{streak}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>ngày sạch</div>
        </div>

        <nav style={{ flex: 1, padding: '8px' }}>
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: '13px',
                textDecoration: 'none',
                marginBottom: '2px',
                background: isActive ? 'var(--bg-accent)' : 'transparent',
                color: isActive ? 'var(--text-accent)' : 'var(--text-secondary)',
              })}
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleSignOut}
          style={{
            margin: '12px',
            padding: '9px 12px',
            background: 'transparent',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius)',
            color: 'var(--text-muted)',
            fontSize: '13px',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          Đăng xuất
        </button>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
