import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useExpenses } from '../hooks/useExpenses'
import { useInsights } from '../hooks/useInsights'
import { useExpenseStore } from '../store/expenseStore'
import { useAuth } from '../hooks/useAuth'
import { MonthPicker } from '../components/MonthPicker'
import { ExpenseCard } from '../components/ExpenseCard'
import { InsightCard } from '../components/InsightCard'
import { DonutChart, DailyBarChart } from '../components/SpendingChart'
import { SkeletonCard } from '../components/SkeletonLoader'

function BudgetBar({ spent, limit }: { spent: number; limit: number }) {
  const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
  const color = pct >= 90 ? '#EF4444' : pct >= 70 ? '#F59E0B' : '#10B981'
  return (
    <div>
      <div className="flex justify-between text-xs mb-2">
        <span className="text-text-muted font-medium">Budget used</span>
        <span className="font-bold" style={{ color }}>{pct.toFixed(0)}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/5 overflow-hidden border border-white/5">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}60` }} />
      </div>
      <div className="flex justify-between text-xs mt-1.5">
        <span className="text-text-muted">₱{spent.toFixed(2)} spent</span>
        <span className="text-text-muted">₱{limit.toFixed(2)} limit</span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { expenses, budget, deleteExpense, updateBudgetLimit } = useExpenses()
  const { selectedMonth } = useExpenseStore()
  const { insights, loading: insightsLoading, error: insightsError, loadInsights } = useInsights()
  const [editingBudget, setEditingBudget] = useState(false)
  const [budgetInput, setBudgetInput] = useState('')

  const total = expenses.reduce((s, e) => s + e.amount, 0)
  const recent = expenses.slice(0, 3)

  useEffect(() => {
    if (expenses.length > 0) {
      loadInsights(selectedMonth, expenses, total, budget.limit, 0)
    }
  }, [selectedMonth]) // eslint-disable-line

  const saveBudget = async () => {
    const val = parseFloat(budgetInput)
    if (val > 0) await updateBudgetLimit(val)
    setEditingBudget(false)
  }

  const [year, month] = selectedMonth.split('-').map(Number)
  const monthName = new Date(year, month - 1).toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })

  return (
    <div className="pb-32 animate-fade-in">
      {/* Header with gradient */}
      <div className="relative overflow-hidden px-4 pt-12 pb-6"
        style={{ background: 'linear-gradient(180deg, rgba(108,99,255,0.12) 0%, transparent 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top, rgba(108,99,255,0.1) 0%, transparent 70%)' }} />
        <div className="flex items-start justify-between relative z-10">
          <div>
            <p className="text-text-muted text-sm mb-1">Good day 👋</p>
            <h1 className="text-2xl font-bold gradient-text">Gastador</h1>
            <p className="text-text-muted text-xs mt-0.5 truncate max-w-[180px]">{user?.email}</p>
          </div>
          <button onClick={signOut}
            className="text-text-muted text-xs px-3 py-2 rounded-xl bg-card border border-border/50 hover:text-text-primary transition-all">
            Sign out
          </button>
        </div>

        {/* Total amount hero */}
        <div className="mt-6">
          <p className="text-text-muted text-xs font-semibold uppercase tracking-widest mb-1">{monthName}</p>
          <p className="text-5xl font-bold text-text-primary tracking-tight">
            ₱<span className="gradient-text">{total.toFixed(2)}</span>
          </p>
          <p className="text-text-muted text-sm mt-1">{expenses.length} transaction{expenses.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Month picker */}
        <div className="flex justify-center"><MonthPicker /></div>

        {/* Budget card */}
        <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-text-primary font-bold text-sm">Monthly Budget</p>
            <button onClick={() => { setEditingBudget(!editingBudget); setBudgetInput(String(budget.limit)) }}
              className="text-primary text-xs font-semibold px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all">
              {editingBudget ? 'Cancel' : 'Edit'}
            </button>
          </div>
          {editingBudget ? (
            <div className="flex gap-2">
              <input type="number" value={budgetInput} onChange={(e) => setBudgetInput(e.target.value)}
                className="flex-1 bg-background text-text-primary rounded-xl px-3 py-2.5 text-sm outline-none border border-primary"
                placeholder="Enter budget limit" />
              <button onClick={saveBudget}
                className="text-white rounded-xl px-4 py-2 text-sm font-bold shadow-glow-sm"
                style={{ background: 'linear-gradient(135deg, #6C63FF, #8B85FF)' }}>
                Save
              </button>
            </div>
          ) : (
            <BudgetBar spent={total} limit={budget.limit} />
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-card">
            <p className="text-text-primary font-bold text-sm mb-3">Spending by Category</p>
            <DonutChart expenses={expenses} />
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-card">
            <p className="text-text-primary font-bold text-sm mb-3">Daily Spending</p>
            <DailyBarChart expenses={expenses} month={selectedMonth} />
          </div>
        </div>

        {/* Recent expenses */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-text-primary font-bold text-sm">Recent Expenses</p>
            <Link to="/history" className="text-primary text-xs font-semibold px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all">
              See all →
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="bg-card rounded-2xl p-8 text-center border border-border/50">
              <p className="text-4xl mb-3 animate-float">📭</p>
              <p className="text-text-primary font-semibold">No expenses yet</p>
              <p className="text-text-muted text-sm mt-1">Tap + to add your first expense</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recent.map((e) => <ExpenseCard key={e.id} expense={e} onDelete={deleteExpense} />)}
            </div>
          )}
        </div>

        {/* AI Insights */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-text-primary font-bold text-sm">✨ AI Insights</p>
            {insightsLoading && <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
          </div>
          {insightsLoading ? (
            <div className="space-y-2"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
          ) : insightsError ? (
            <div className="bg-card rounded-2xl p-5 text-center border border-border/50">
              <p className="text-text-muted text-sm mb-2">{insightsError}</p>
              <button onClick={() => loadInsights(selectedMonth, expenses, total, budget.limit, 0)}
                className="text-primary text-sm font-semibold">Retry</button>
            </div>
          ) : insights.length === 0 && expenses.length > 0 ? (
            <div className="space-y-2"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
          ) : insights.length === 0 ? (
            <div className="bg-card rounded-2xl p-5 text-center border border-border/50">
              <p className="text-text-muted text-sm">Add expenses to get AI-powered insights</p>
            </div>
          ) : (
            <div className="space-y-2">
              {insights.slice(0, 3).map((ins, i) => <InsightCard key={i} insight={ins} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
