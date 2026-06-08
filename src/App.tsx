import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { Navbar } from './components/Navbar'
import Dashboard from './pages/Dashboard'
import AddExpense from './pages/AddExpense'
import History from './pages/History'
import Insights from './pages/Insights'
import Login from './pages/Login'

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-app w-full min-h-screen relative">
        {children}
        <Navbar />
      </div>
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <Routes location={location}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/add" element={<AddExpense />} />
      <Route path="/history" element={<History />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl animate-float shadow-glow"
            style={{ background: 'linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%)' }}>
            💸
          </div>
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!user) return <Login />

  return (
    <AppShell>
      <AnimatedRoutes />
    </AppShell>
  )
}
