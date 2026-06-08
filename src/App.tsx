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
    <div className="min-h-screen bg-[#0A0A12] flex justify-center relative overflow-x-hidden"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(124,111,255,0.06) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}>
      {/* Subtle glow behind the column */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[480px] h-full bg-primary/5 blur-3xl pointer-events-none" />

      {/* App column */}
      <div className="relative w-full max-w-app min-h-screen bg-bg overflow-x-hidden
                      lg:border-x lg:border-t lg:border-border/60 lg:shadow-[0_0_60px_rgba(0,0,0,0.6)]">
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
          <svg width="64" height="64" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="28" height="28" rx="8" fill="#7C6FFF"/>
            <path d="M19.5 10.8C18.4 9.1 16.4 8 14 8C10.7 8 8 10.7 8 14C8 17.3 10.7 20 14 20C16.8 20 19.1 18.1 19.8 15.5H14V13.5H22V14C22 18.4 18.4 22 14 22C9.6 22 6 18.4 6 14C6 9.6 9.6 6 14 6C16.9 6 19.5 7.5 21 9.8L19.5 10.8Z" fill="white"/>
          </svg>
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
