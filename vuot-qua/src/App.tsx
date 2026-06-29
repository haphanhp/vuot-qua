import { Routes, Route } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { useProfile } from './hooks/useProfile'
import { LangProvider, useLang } from './i18n/LangContext'
import { Sidebar } from './components/Sidebar'
import { LanguagePicker } from './pages/LanguagePicker'
import { Auth } from './pages/Auth'
import { Home } from './pages/Home'
import { Coach } from './pages/Coach'
import { Journal } from './pages/Journal'
import { History } from './pages/History'
import { Milestones } from './pages/Milestones'

function AppInner() {
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading, refreshProfile } = useProfile()
  const { lang } = useLang()

  if (authLoading || profileLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>...</div>
      </div>
    )
  }

  // Lần đầu vào chưa chọn ngôn ngữ
  if (lang === 'unset' as string) return <LanguagePicker />

  if (!user) return <Auth />

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar profile={profile} />
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <Routes>
          <Route path="/" element={<Home profile={profile} onRefresh={refreshProfile} />} />
          <Route path="/coach" element={<Coach profile={profile} />} />
          <Route path="/journal" element={<Journal profile={profile} />} />
          <Route path="/history" element={<History profile={profile} />} />
          <Route path="/milestones" element={<Milestones profile={profile} />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <LangProvider>
      <AppInner />
    </LangProvider>
  )
}
