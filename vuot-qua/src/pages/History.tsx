import { useState, useEffect } from 'react'
import { supabase, type CravingLog, type Profile } from '../lib/supabase'
import { useLang } from '../i18n/LangContext'

export function History({ profile }: { profile: Profile | null }) {
  const { t } = useLang()
  const [logs, setLogs] = useState<CravingLog[]>([])

  useEffect(() => {
    if (!profile) return
    supabase.from('craving_logs').select('*').eq('user_id', profile.id)
      .order('created_at', { ascending: false }).limit(50)
      .then(({ data }) => setLogs(data || []))
  }, [profile])

  const OUTCOME_STYLE = {
    overcame: { bg: 'var(--color-success-bg)', color: 'var(--color-success)', label: t.overcame, icon: 'ti-check' },
    relapse: { bg: 'var(--color-danger-bg)', color: 'var(--color-danger)', label: t.relapse, icon: 'ti-alert-triangle' },
    in_progress: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)', label: t.logged, icon: 'ti-wave-square' },
  }

  const fmt = (d: string) => new Date(d).toLocaleString(undefined, { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 500 }}>{t.historyTitle}</h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>{t.historySubtitle}</p>
      </div>
      {logs.length === 0 && <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>{t.noHistory}</p>}
      {logs.map(log => {
        const style = OUTCOME_STYLE[log.outcome]
        return (
          <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', borderRadius: 'var(--radius)', marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: style.bg, color: style.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className={`ti ${style.icon}`} style={{ fontSize: 15 }} aria-hidden />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{log.trigger} · {log.intensity}/10</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                {fmt(log.created_at)}{log.note ? ` · ${log.note.slice(0, 60)}` : ''}
              </div>
            </div>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: style.bg, color: style.color }}>{style.label}</span>
          </div>
        )
      })}
    </div>
  )
}
