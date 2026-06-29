import { NavLink } from 'react-router-dom'
import type { Profile } from '../lib/supabase'
import { useLang } from '../i18n/LangContext'
import { supabase } from '../lib/supabase'
import type { Lang } from '../i18n/strings'

export function Sidebar({ profile }: { profile: Profile | null }) {
  const { t, lang, setLang } = useLang()

  const NAV = [
    { to: '/', icon: 'ti-home', label: t.navHome },
    { to: '/coach', icon: 'ti-message-circle', label: t.navCoach },
    { to: '/journal', icon: 'ti-notebook', label: t.navJournal },
    { to: '/history', icon: 'ti-history', label: t.navHistory },
    { to: '/milestones', icon: 'ti-trophy', label: t.navMilestones },
  ]

  return (
    <aside style={{
      width: 220, background: 'var(--color-surface)',
      borderRight: '0.5px solid var(--color-border)',
      display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100vh',
    }}>
      <div style={{ padding: '20px 16px 12px' }}>
        <h1 style={{ fontSize: 16, fontWeight: 500 }}>{t.appName}</h1>
        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{t.appTagline}</p>
      </div>

      <div style={{
        margin: '0 12px 12px', background: 'var(--color-surface-2)',
        border: '0.5px solid var(--color-border)', borderRadius: 12, padding: 14, textAlign: 'center',
      }}>
        <div style={{ fontSize: 32, fontWeight: 500, lineHeight: 1 }}>{profile?.current_streak ?? 0}</div>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>{t.streakDays}</div>
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

      <div style={{ padding: '12px', borderTop: '0.5px solid var(--color-border)' }}>
        {/* Language toggle */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
          {(['vi', 'en'] as Lang[]).map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              flex: 1, padding: '5px 0', borderRadius: 6, fontSize: 11, cursor: 'pointer',
              background: lang === l ? 'var(--color-accent-bg)' : 'transparent',
              border: `0.5px solid ${lang === l ? 'var(--color-accent-border)' : 'var(--color-border)'}`,
              color: lang === l ? 'var(--color-accent)' : 'var(--color-text-muted)',
            }}>{l === 'vi' ? '🇻🇳 VI' : '🇺🇸 EN'}</button>
          ))}
        </div>

        {/* Sign out */}
        <button onClick={() => supabase.auth.signOut()} style={{
          width: '100%', padding: '7px 0', borderRadius: 6, fontSize: 12,
          background: 'transparent', border: '0.5px solid var(--color-border)',
          color: 'var(--color-text-muted)', cursor: 'pointer',
        }}>
          <i className="ti ti-logout" style={{ fontSize: 13, marginRight: 6 }} aria-hidden />
          {t.signOut}
        </button>

        {profile && (
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8, textAlign: 'center' }}>
            {profile.display_name || profile.email}
          </div>
        )}
      </div>
    </aside>
  )
}
