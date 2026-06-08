import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { Navbar } from './components/Navbar'
import Dashboard from './pages/Dashboard'
import AddExpense from './pages/AddExpense'
import History from './pages/History'
import Insights from './pages/Insights'
import Profile from './pages/Profile'
import Login from './pages/Login'

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    // Outer: full viewport with branded desktop background
    <div className="min-h-screen bg-[#0A0A12] flex justify-center relative"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(124,111,255,0.06) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}>
      {/* Subtle glow behind the column */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[480px] h-full bg-primary/3 blur-3xl pointer-events-none" />

      {/* App column */}
      <div className="relative w-full max-w-app min-h-screen bg-bg overflow-x-hidden
                      lg:border-x lg:border-border/60 lg:shadow-[0_0_60px_rgba(0,0,0,0.6)]">
        {children}
        <Navbar />
      </div>
    </div>
  )
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-3xl shadow-primary">
            💸
          </div>
          <div className="w-5 h-5 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!user) return <Login />

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddExpense />} />
        <Route path="/history" element={<History />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}
