import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useExpenses } from '../hooks/useExpenses'
import { useExpenseStore } from '../store/expenseStore'
import { toast } from 'react-hot-toast'

const VERSION = '1.0.0'

export default function Profile() {
  const { user, signOut } = useAuth()
  const { expenses, budget, updateBudgetLimit } = useExpenses()
  const { selectedMonth } = useExpenseStore()
  const [budgetInput, setBudgetInput] = useState(String(budget.limit))
  const [editingBudget, setEditingBudget] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? 'GU'
  const email = user?.email ?? ''
  const memberSince = user?.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })
    : 'Unknown'

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0)
  const topCategory = (() => {
    const map: Record<string, number> = {}
    for (const e of expenses) map[e.category] = (map[e.category] ?? 0) + e.amount
    return Object.entries(map).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'
  })()

  const handleSaveBudget = async () => {
    const val = parseFloat(budgetInput)
    if (!val || val <= 0) return toast.error('Enter a valid amount')
    await updateBudgetLimit(val)
    setEditingBudget(false)
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut()
  }

  return (
    <div className="pb-32 animate-fade-in bg-bg min-h-screen overflow-x-hidden">
      {/* Header */}
      <div className="px-5 pt-14 pb-8">
        <h1 className="text-text-1 text-xl font-bold mb-8">Profile</h1>

        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-3xl font-bold text-white mb-4 bg-primary shadow-primary animate-float">
            {initials}
          </div>
          <p className="text-text-1 font-bold text-base">{email}</p>
          <p className="text-text-3 text-xs mt-1">Member since {memberSince}</p>
        </div>
      </div>

      <div className="px-5 space-y-3">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Expenses', value: String(expenses.length) },
            { label: 'Spent', value: `₱${totalSpent.toFixed(0)}` },
            { label: 'Top Cat.', value: topCategory },
          ].map((stat) => (
            <div key={stat.label} className="card p-3 text-center">
              <p className="text-text-1 font-bold text-base truncate">{stat.value}</p>
              <p className="text-text-3 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Budget settings */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-text-1 font-bold text-sm">Monthly Budget</p>
              <p className="text-text-3 text-xs mt-0.5">{selectedMonth}</p>
            </div>
            <button onClick={() => setEditingBudget(!editingBudget)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-primary-bg text-primary">
              {editingBudget ? 'Cancel' : 'Edit'}
            </button>
          </div>
          {editingBudget ? (
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-surface rounded-xl px-3 py-2.5 border border-primary/50">
                <span className="text-primary font-bold">₱</span>
                <input type="number" value={budgetInput} onChange={(e) => setBudgetInput(e.target.value)}
                  className="flex-1 bg-transparent text-text-1 text-sm outline-none" placeholder="10000" />
              </div>
              <button onClick={handleSaveBudget}
                className="bg-primary text-white rounded-xl px-4 py-2 text-sm font-bold shadow-primary-sm">
                Save
              </button>
            </div>
          ) : (
            <p className="text-3xl font-bold gradient-text">₱{budget.limit.toLocaleString()}</p>
          )}
        </div>

        {/* Account info */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="section-label">Account</p>
          </div>
          {[
            { icon: '📧', label: 'Email', value: email },
            { icon: '🔒', label: 'Password', value: '••••••••' },
            { icon: '📅', label: 'Member since', value: memberSince },
            { icon: '🆔', label: 'User ID', value: (user?.uid?.slice(0, 12) ?? '—') + '…' },
          ].map((item, i, arr) => (
            <div key={item.label}
              className={`flex items-center gap-3 px-4 py-3.5 ${i < arr.length - 1 ? 'border-b border-border/40' : ''}`}>
              <span className="text-lg w-7">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-text-3 text-xs">{item.label}</p>
                <p className="text-text-1 text-sm font-medium truncate mt-0.5">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* App info */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="section-label">App</p>
          </div>
          {[
            { icon: '💸', label: 'App Name', value: 'Gastador' },
            { icon: '🔢', label: 'Version', value: VERSION },
            { icon: '🤖', label: 'AI Model', value: 'Llama 3 (Groq)' },
            { icon: '☁️', label: 'Database', value: 'Firebase Firestore' },
          ].map((item, i, arr) => (
            <div key={item.label}
              className={`flex items-center gap-3 px-4 py-3.5 ${i < arr.length - 1 ? 'border-b border-border/40' : ''}`}>
              <span className="text-lg w-7">{item.icon}</span>
              <div className="flex-1">
                <p className="text-text-3 text-xs">{item.label}</p>
                <p className="text-text-1 text-sm font-medium mt-0.5">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sign out */}
        <button onClick={handleSignOut} disabled={signingOut}
          className="w-full py-4 rounded-2xl font-bold text-danger text-sm border border-danger/30 bg-danger/5 hover:bg-danger/10 transition-all active:scale-[0.98] disabled:opacity-50">
          {signingOut ? 'Signing out…' : '🚪 Sign Out'}
        </button>

        <p className="text-center text-text-3 text-xs pb-2">Made with 💜 · Gastador v{VERSION}</p>
      </div>
    </div>
  )
}
