import { useLang } from '../i18n/LangContext'

export function LanguagePicker() {
  const { setLang } = useLang()

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg)',
    }}>
      <div style={{
        width: 340, background: 'var(--color-surface)',
        border: '0.5px solid var(--color-border)', borderRadius: 16, padding: 32, textAlign: 'center',
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🌏</div>
        <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 6 }}>Chọn ngôn ngữ / Choose Language</h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 28 }}>
          Bạn có thể thay đổi sau · You can change this later
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={() => setLang('vi')} style={{
            padding: '14px 20px', borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: 'pointer',
            background: 'var(--color-accent-bg)', border: '1.5px solid var(--color-accent-border)',
            color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: 24 }}>🇻🇳</span>
            <div style={{ textAlign: 'left' }}>
              <div>Tiếng Việt</div>
              <div style={{ fontSize: 12, fontWeight: 400, opacity: 0.8 }}>Giao diện hoàn toàn tiếng Việt</div>
            </div>
          </button>

          <button onClick={() => setLang('en')} style={{
            padding: '14px 20px', borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: 'pointer',
            background: 'var(--color-surface-2)', border: '1.5px solid var(--color-border)',
            color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: 24 }}>🇺🇸</span>
            <div style={{ textAlign: 'left' }}>
              <div>English</div>
              <div style={{ fontSize: 12, fontWeight: 400, color: 'var(--color-text-muted)' }}>Full English interface</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
