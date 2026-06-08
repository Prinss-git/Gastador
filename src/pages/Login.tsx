import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-hot-toast'

const FEATURES = [
  { icon: '🤖', text: 'AI auto-categorizes every expense' },
  { icon: '💰', text: 'Track your allowance vs spending' },
  { icon: '📊', text: 'Monthly insights powered by Groq' },
  { icon: '📱', text: 'Installable PWA — works offline' },
]

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
    <div className="min-h-screen bg-bg flex flex-col lg:flex-row relative overflow-hidden">
      {/* ── Left panel — branding (desktop only) ── */}
      <div className="hidden lg:flex flex-col justify-between p-12 flex-1 relative overflow-hidden border-r border-border">
        {/* Background orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative">
          <svg width="40" height="40" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
            <rect width="28" height="28" rx="8" fill="#7C6FFF"/>
            <path d="M19.5 10.8C18.4 9.1 16.4 8 14 8C10.7 8 8 10.7 8 14C8 17.3 10.7 20 14 20C16.8 20 19.1 18.1 19.8 15.5H14V13.5H22V14C22 18.4 18.4 22 14 22C9.6 22 6 18.4 6 14C6 9.6 9.6 6 14 6C16.9 6 19.5 7.5 21 9.8L19.5 10.8Z" fill="white"/>
          </svg>
          <span className="text-text-1 text-xl font-bold tracking-tight">Gastador</span>
        </div>

        {/* Headline */}
        <div className="relative">
          <h2 className="text-text-1 text-3xl font-bold leading-snug mb-3">
            Know exactly where<br />your money goes.
          </h2>
          <p className="text-text-3 text-sm mb-8 leading-relaxed">
            An AI-powered expense tracker built for Filipinos.<br />
            Log expenses in seconds, understand your spending in minutes.
          </p>
          <div className="space-y-3">
            {FEATURES.map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <span className="text-base w-6 text-center flex-shrink-0">{f.icon}</span>
                <span className="text-text-2 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-text-3 text-xs relative">Secured with Firebase · Free forever</p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex flex-col justify-center flex-1 px-6 lg:px-16 py-16 lg:max-w-md lg:mx-auto w-full relative">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-12">
          <svg width="36" height="36" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
            <rect width="28" height="28" rx="8" fill="#7C6FFF"/>
            <path d="M19.5 10.8C18.4 9.1 16.4 8 14 8C10.7 8 8 10.7 8 14C8 17.3 10.7 20 14 20C16.8 20 19.1 18.1 19.8 15.5H14V13.5H22V14C22 18.4 18.4 22 14 22C9.6 22 6 18.4 6 14C6 9.6 9.6 6 14 6C16.9 6 19.5 7.5 21 9.8L19.5 10.8Z" fill="white"/>
          </svg>
          <span className="text-text-1 text-lg font-bold tracking-tight">Gastador</span>
        </div>

        <h2 className="text-text-1 text-2xl font-bold mb-1">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        <p className="text-text-3 text-sm mb-8">
          {mode === 'login'
            ? 'Sign in to continue tracking'
            : 'Start tracking your expenses today'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-text-3 text-xs font-medium block mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              required placeholder="you@example.com" autoComplete="email"
              className="w-full bg-bg-elevated border border-border rounded-2xl px-4 py-3.5 text-text-1 text-sm
                         outline-none placeholder:text-text-3 focus:border-primary/50 transition-colors duration-150" />
          </div>

          <div>
            <label className="text-text-3 text-xs font-medium block mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              required placeholder="Min. 6 characters" minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="w-full bg-bg-elevated border border-border rounded-2xl px-4 py-3.5 text-text-1 text-sm
                         outline-none placeholder:text-text-3 focus:border-primary/50 transition-colors duration-150" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-primary text-white rounded-2xl py-4 font-semibold text-sm shadow-primary
                       transition-all duration-150 active:scale-[0.98] disabled:opacity-50
                       flex items-center justify-center gap-2 mt-2">
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Loading…</>
              : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-text-3 text-sm mt-6 text-center">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-primary font-semibold">
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
