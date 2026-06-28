import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signin'|'signup'>('signin')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async () => {
    setLoading(true); setMsg('')
    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMsg(error.message)
      else setMsg('Kiểm tra email để xác nhận tài khoản')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMsg(error.message)
    }
    setLoading(false)
  }

  const inp = (val: string, set: (v:string)=>void, ph: string, type='text') => (
    <input type={type} value={val} onChange={e => set(e.target.value)} placeholder={ph}
      style={{ width:'100%', padding:'10px 14px', marginBottom:12, background:'var(--color-surface-2)',
        border:'0.5px solid var(--color-border)', borderRadius:'var(--radius)',
        fontSize:14, color:'var(--color-text)', outline:'none' }} />
  )

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--color-bg)' }}>
      <div style={{ width:360, background:'var(--color-surface)', border:'0.5px solid var(--color-border)', borderRadius:16, padding:32 }}>
        <h1 style={{ fontSize:20, fontWeight:500, marginBottom:4 }}>Vượt Qua</h1>
        <p style={{ fontSize:13, color:'var(--color-text-muted)', marginBottom:28 }}>AI recovery coach</p>
        {inp(email, setEmail, 'Email')}
        {inp(password, setPassword, 'Mật khẩu', 'password')}
        {msg && <p style={{ fontSize:13, color:'var(--color-danger)', marginBottom:12 }}>{msg}</p>}
        <button onClick={handle} disabled={loading} style={{
          width:'100%', padding:12, background:'var(--color-accent)',
          color:'white', border:'none', borderRadius:'var(--radius)', fontSize:14, fontWeight:500, marginBottom:12,
        }}>{loading ? 'Đang xử lý...' : (mode === 'signin' ? 'Đăng nhập' : 'Tạo tài khoản')}</button>
        <button onClick={() => setMode(mode==='signin'?'signup':'signin')} style={{
          width:'100%', padding:10, background:'transparent', border:'none', color:'var(--color-text-muted)', fontSize:13,
        }}>{mode==='signin' ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}</button>
      </div>
    </div>
  )
}
