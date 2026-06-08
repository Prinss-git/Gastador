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
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-app w-full min-h-screen relative overflow-x-hidden">
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
