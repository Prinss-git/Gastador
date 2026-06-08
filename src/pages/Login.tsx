import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-hot-toast'

export default function Login() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'login') {
        await signIn(email, password)
      } else {
        await signUp(email, password)
        toast.success('Account created!')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      toast.error(msg.replace('Firebase: ', '').replace(/ \(auth\/.*\)/, ''))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute top-[-15%] left-[-5%] w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6C63FF, transparent)' }} />
      <div className="absolute bottom-[-10%] right-[-5%] w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FF6B9D, transparent)' }} />

      <div className="w-full max-w-sm animate-slide-up relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-4xl mb-5 shadow-glow animate-float"
            style={{ background: 'linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%)' }}>
            💸
          </div>
          <h1 className="text-4xl font-bold mb-2 gradient-text">Gastador</h1>
          <p className="text-text-muted text-sm">Your AI-powered expense tracker</p>
        </div>

        <div className="glass-strong rounded-3xl p-6">
          <div className="flex rounded-xl bg-background/80 p-1 mb-6 border border-border/40">
            {(['login', 'signup'] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                  mode === m ? 'text-white' : 'text-text-muted hover:text-text-secondary'
                }`}
                style={mode === m ? { background: 'linear-gradient(135deg, #6C63FF, #8B85FF)' } : {}}>
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-text-secondary text-xs font-bold mb-2 uppercase tracking-widest">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="you@example.com"
                className="w-full bg-background/50 text-text-primary rounded-xl px-4 py-3.5 text-sm outline-none border border-border focus:border-primary transition-all placeholder:text-text-muted" />
            </div>
            <div>
              <label className="block text-text-secondary text-xs font-bold mb-2 uppercase tracking-widest">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                placeholder="••••••••" minLength={6}
                className="w-full bg-background/50 text-text-primary rounded-xl px-4 py-3.5 text-sm outline-none border border-border focus:border-primary transition-all placeholder:text-text-muted" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full text-white rounded-xl py-4 font-bold text-sm mt-2 transition-all active:scale-95 disabled:opacity-50 shadow-glow"
              style={{ background: 'linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%)' }}>
              {loading
                ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Loading…</span>
                : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-text-muted text-xs mt-5">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-primary-light font-bold hover:text-primary transition-colors">
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
