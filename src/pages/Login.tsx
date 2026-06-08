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
      if (mode === 'login') await signIn(email, password)
      else { await signUp(email, password); toast.success('Welcome to Gastador!') }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      toast.error(msg.replace('Firebase: ', '').replace(/ \(auth\/.*\)/, ''))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-5 py-10 relative overflow-hidden">
      {/* Soft background blobs */}
      <div className="absolute top-[-10%] left-[-20%] w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none bg-primary" />
      <div className="absolute bottom-[-5%] right-[-15%] w-64 h-64 rounded-full opacity-8 blur-3xl pointer-events-none bg-coral" />

      <div className="w-full max-w-sm animate-slide-up">
        {/* Logo mark */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-4xl mb-5 shadow-primary animate-float">
            💸
          </div>
          <h1 className="text-3xl font-bold text-text-1 tracking-tight">Gastador</h1>
          <p className="text-text-3 text-sm mt-2">Track smarter. Spend wiser.</p>
        </div>

        {/* Auth card */}
        <div className="card-elevated p-6">
          {/* Tab switcher */}
          <div className="flex bg-surface rounded-xl p-1 mb-6">
            {(['login', 'signup'] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === m
                    ? 'bg-primary text-white shadow-primary-sm'
                    : 'text-text-3 hover:text-text-2'
                }`}>
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="section-label">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required placeholder="you@example.com" className="input" autoComplete="email" />
            </div>
            <div className="space-y-1.5">
              <label className="section-label">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                required placeholder="Min. 6 characters" minLength={6} className="input"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary mt-2 flex items-center justify-center gap-2">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Loading…</>
                : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-text-3 text-xs mt-5">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-primary font-semibold hover:text-primary-soft transition-colors">
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>

        <p className="text-center text-text-3 text-xs mt-6">
          Your data is private and encrypted with Firebase
        </p>
      </div>
    </div>
  )
}
