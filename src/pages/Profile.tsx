import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useExpenses } from '../hooks/useExpenses'
import { useExpenseStore } from '../store/expenseStore'
import { toast } from 'react-hot-toast'

const VERSION = '1.0.0'

function RowItem({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <span className="text-text-2 text-sm">{label}</span>
      <span className={`text-sm font-medium max-w-[55%] truncate text-right ${danger ? 'text-danger' : 'text-text-1'}`}>
        {value}
      </span>
    </div>
  )
}

export default function Profile() {
  const { user, signOut } = useAuth()
  const { expenses, budget, updateBudgetLimit } = useExpenses()
  const { selectedMonth } = useExpenseStore()
  const [budgetInput, setBudgetInput] = useState(String(budget.limit))
  const [editingBudget, setEditingBudget] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const initials = (user?.email?.slice(0, 2) ?? 'GU').toUpperCase()
  const email = user?.email ?? ''
  const memberSince = user?.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })
    : '—'

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
    toast.success('Budget updated')
  }

  return (
    <div className="pb-32 min-h-screen bg-bg overflow-x-hidden animate-fade-in">
      {/* Header */}
      <div className="px-5 pt-14 pb-8">
        <h1 className="text-text-1 text-xl font-bold mb-8">Profile</h1>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-xl font-bold text-white shadow-primary-sm flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-text-1 font-semibold text-base truncate">{email}</p>
            <p className="text-text-3 text-xs mt-0.5">Member since {memberSince}</p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 px-5 mb-5">
        {[
          { label: 'Expenses', value: String(expenses.length) },
          { label: 'Spent', value: `₱${totalSpent >= 1000 ? (totalSpent / 1000).toFixed(1) + 'k' : totalSpent.toFixed(0)}` },
          { label: 'Top Cat.', value: topCategory },
        ].map((s) => (
          <div key={s.label} className="bg-bg-elevated rounded-2xl border border-border px-3 py-3 text-center">
            <p className="text-text-1 font-bold text-sm truncate">{s.value}</p>
            <p className="text-text-3 text-[10px] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="px-5 space-y-3">
        {/* Budget */}
        <div className="bg-bg-elevated rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/50">
            <div>
              <p className="text-text-1 text-sm font-semibold">Monthly Allowance</p>
              <p className="text-text-3 text-xs mt-0.5">{selectedMonth}</p>
            </div>
            <button onClick={() => setEditingBudget(!editingBudget)}
              className="text-xs font-semibold text-primary bg-primary-bg px-3 py-1.5 rounded-xl">
              {editingBudget ? 'Cancel' : 'Edit'}
            </button>
          </div>
          <div className="px-4 py-3.5">
            {editingBudget ? (
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 bg-surface rounded-xl px-3 py-2.5 border border-primary/40">
                  <span className="text-primary font-semibold text-sm">₱</span>
                  <input type="number" value={budgetInput} onChange={(e) => setBudgetInput(e.target.value)}
                    className="flex-1 bg-transparent text-text-1 text-sm outline-none" placeholder="e.g. 5000" autoFocus />
                </div>
                <button onClick={handleSaveBudget}
                  className="bg-primary text-white rounded-xl px-4 text-sm font-semibold shadow-primary-sm">
                  Save
                </button>
              </div>
            ) : (
              <p className="text-text-1 font-bold text-2xl">₱{budget.limit.toLocaleString()}</p>
            )}
          </div>
        </div>

        {/* Account info */}
        <div className="bg-bg-elevated rounded-2xl border border-border overflow-hidden divide-y divide-border/50">
          <div className="px-4 py-2.5">
            <p className="text-text-3 text-[10px] font-semibold uppercase tracking-widest">Account</p>
          </div>
          <RowItem label="Email" value={email} />
          <RowItem label="Member since" value={memberSince} />
          <RowItem label="User ID" value={(user?.uid?.slice(0, 14) ?? '—') + '…'} />
        </div>

        {/* App info */}
        <div className="bg-bg-elevated rounded-2xl border border-border overflow-hidden divide-y divide-border/50">
          <div className="px-4 py-2.5">
            <p className="text-text-3 text-[10px] font-semibold uppercase tracking-widest">App</p>
          </div>
          <RowItem label="Version" value={VERSION} />
          <RowItem label="AI Model" value="Llama 3 · Groq" />
          <RowItem label="Database" value="Firebase Firestore" />
        </div>

        {/* Sign out */}
        <button onClick={async () => { setSigningOut(true); await signOut() }}
          disabled={signingOut}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold text-danger border border-danger/25 bg-danger/5
                     transition-all active:scale-[0.98] disabled:opacity-50">
          {signingOut ? 'Signing out…' : 'Sign Out'}
        </button>

        <p className="text-center text-text-3 text-xs pb-2">Gastador v{VERSION}</p>
      </div>
    </div>
  )
}
