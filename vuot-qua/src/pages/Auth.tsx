import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useLang } from '../i18n/LangContext'
import type { Lang } from '../i18n/strings'

export function Auth() {
  const { t, lang, setLang } = useLang()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [remember, setRemember] = useState(true)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async () => {
    setLoading(true); setMsg('')
    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMsg(error.message)
      else setMsg(lang === 'vi' ? 'Kiểm tra email để xác nhận tài khoản' : 'Check your email to confirm your account')
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email, password,
        options: { /* Supabase auto-persists session */ }
      })
      if (error) setMsg(error.message)
      // Nếu không remember, clear khi đóng tab
      if (!remember) {
        sessionStorage.setItem('no_persist', '1')
      } else {
        sessionStorage.removeItem('no_persist')
      }
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg)',
    }}>
      <div style={{
        width: 380, background: 'var(--color-surface)',
        border: '0.5px solid var(--color-border)', borderRadius: 16, padding: 32,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>{t.appName}</h1>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{t.appTagline}</p>
          </div>
          {/* Language toggle */}
          <div style={{ display: 'flex', gap: 4 }}>
            {(['vi', 'en'] as Lang[]).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding: '4px 10px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                background: lang === l ? 'var(--color-accent-bg)' : 'transparent',
                border: `0.5px solid ${lang === l ? 'var(--color-accent-border)' : 'var(--color-border)'}`,
                color: lang === l ? 'var(--color-accent)' : 'var(--color-text-muted)',
              }}>{l === 'vi' ? '🇻🇳 VI' : '🇺🇸 EN'}</button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        {[
          { val: email, set: setEmail, ph: t.email, type: 'email' },
          { val: password, set: setPassword, ph: t.password, type: 'password' },
        ].map(f => (
          <input key={f.ph} type={f.type} value={f.val} onChange={e => f.set(e.target.value)}
            placeholder={f.ph}
            onKeyDown={e => e.key === 'Enter' && handle()}
            style={{
              width: '100%', padding: '11px 14px', marginBottom: 10,
              background: 'var(--color-surface-2)', border: '0.5px solid var(--color-border)',
              borderRadius: 8, fontSize: 14, color: 'var(--color-text)', outline: 'none',
              display: 'block',
            }}
          />
        ))}

        {/* Remember me */}
        <label style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, cursor: 'pointer',
          fontSize: 13, color: 'var(--color-text-secondary)',
        }}>
          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
            style={{ width: 15, height: 15, cursor: 'pointer' }} />
          {t.rememberMe}
        </label>

        {msg && <p style={{ fontSize: 13, color: 'var(--color-danger)', marginBottom: 12 }}>{msg}</p>}

        <button onClick={handle} disabled={loading} style={{
          width: '100%', padding: 13, background: 'var(--color-accent)',
          color: 'white', border: 'none', borderRadius: 8,
          fontSize: 14, fontWeight: 500, marginBottom: 10, cursor: 'pointer',
        }}>
          {loading ? '...' : (mode === 'signin' ? t.signIn : t.signUp)}
        </button>

        <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setMsg('') }} style={{
          width: '100%', padding: 10, background: 'transparent', border: 'none',
          color: 'var(--color-text-muted)', fontSize: 13, cursor: 'pointer',
        }}>
          {mode === 'signin' ? t.noAccount : t.hasAccount}
        </button>
      </div>
    </div>
  )
}
