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
    <div className="min-h-screen bg-bg flex flex-col px-6 relative overflow-hidden">
      {/* Atmospheric orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      {/* Top wordmark */}
      <div className="pt-20 pb-12 relative">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-xl shadow-primary-sm flex-shrink-0">
            💸
          </div>
          <h1 className="text-text-1 text-2xl font-bold tracking-tight">Gastador</h1>
        </div>
        <p className="text-text-3 text-sm ml-[52px]">Your personal expense tracker</p>
      </div>

      {/* Form */}
      <div className="relative flex-1">
        {/* Mode label */}
        <h2 className="text-text-1 text-xl font-semibold mb-8">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-text-3 text-xs font-medium block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full bg-bg-elevated border border-border rounded-2xl px-4 py-3.5 text-text-1 text-sm outline-none
                         placeholder:text-text-3 focus:border-primary/50 transition-colors duration-150"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-text-3 text-xs font-medium block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Min. 6 characters"
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="w-full bg-bg-elevated border border-border rounded-2xl px-4 py-3.5 text-text-1 text-sm outline-none
                         placeholder:text-text-3 focus:border-primary/50 transition-colors duration-150"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white rounded-2xl py-4 font-semibold text-sm shadow-primary
                       transition-all duration-150 active:scale-[0.98] disabled:opacity-50
                       flex items-center justify-center gap-2 mt-2">
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Loading…</>
              : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Switch mode */}
        <p className="text-text-3 text-sm mt-6 text-center">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-primary font-semibold">
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>

        <p className="text-text-3 text-xs text-center mt-8">
          Secured with Firebase Authentication
        </p>
      </div>
    </div>
  )
}
