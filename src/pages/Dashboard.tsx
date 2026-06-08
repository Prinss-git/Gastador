import { useEffect } from 'react'
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
import { InstallBanner } from '../components/InstallBanner'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function Dashboard() {
  const { user } = useAuth()
  const { expenses, budget, deleteExpense } = useExpenses()
  const { selectedMonth } = useExpenseStore()
  const { insights, loading: insightsLoading, error: insightsError, loadInsights } = useInsights()

  const total = expenses.reduce((s, e) => s + e.amount, 0)
  const pct = budget.limit > 0 ? Math.min((total / budget.limit) * 100, 100) : 0
  const budgetColor = pct >= 90 ? '#F87171' : pct >= 70 ? '#FBBF24' : '#4ADE80'
  const recent = expenses.slice(0, 3)
  const [year, month] = selectedMonth.split('-').map(Number)

  useEffect(() => {
    if (expenses.length > 0)
      loadInsights(selectedMonth, expenses, total, budget.limit, 0)
  }, [selectedMonth]) // eslint-disable-line

  return (
    <div className="pb-32 animate-fade-in bg-bg min-h-screen">

      {/* ── Hero header ── */}
      <div className="px-5 pt-14 pb-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-text-3 text-xs font-semibold uppercase tracking-widest">
              {MONTHS[month - 1]} {year}
            </p>
            <h1 className="text-text-1 text-xl font-bold mt-0.5">
              Hey, {user?.email?.split('@')[0]} 👋
            </h1>
          </div>
          <Link to="/profile"
            className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-sm shadow-primary-sm">
            {user?.email?.slice(0, 1).toUpperCase()}
          </Link>
        </div>

        {/* Total spend card */}
        <div className="bg-primary rounded-3xl p-5 shadow-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-10 translate-x-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-black/10 translate-y-8 -translate-x-6" />
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">Total Spent</p>
          <p className="text-white text-4xl font-bold tracking-tight">
            ₱{total.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-white/50">Budget</span>
              <span className="text-white/80 font-semibold">
                ₱{budget.limit.toLocaleString()} · {pct.toFixed(0)}% used
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: budgetColor }} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-5">
        {/* Month picker */}
        <div className="flex justify-between items-center">
          <MonthPicker />
          <Link to="/add"
            className="text-xs font-semibold text-primary bg-primary-bg px-3 py-1.5 rounded-xl">
            + Add Expense
          </Link>
        </div>

        {/* Install banner */}
        <InstallBanner />

        {/* Charts row */}
        <div className="space-y-3">
          <div className="card p-4">
            <p className="text-text-2 text-xs font-bold uppercase tracking-widest mb-3">By Category</p>
            <DonutChart expenses={expenses} />
          </div>
          <div className="card p-4">
            <p className="text-text-2 text-xs font-bold uppercase tracking-widest mb-3">Daily Spending</p>
            <DailyBarChart expenses={expenses} month={selectedMonth} />
          </div>
        </div>

        {/* Recent expenses */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-text-1 font-bold text-sm">Recent</p>
            <Link to="/history" className="text-primary text-xs font-semibold">See all →</Link>
          </div>
          {recent.length === 0 ? (
            <div className="card p-8 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center text-2xl mb-3 animate-float">📭</div>
              <p className="text-text-1 font-semibold text-sm">No expenses yet</p>
              <p className="text-text-3 text-xs mt-1">Tap + to add your first one</p>
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
            <p className="text-text-1 font-bold text-sm">AI Insights</p>
            <span className="pill bg-primary-bg text-primary text-[10px]">✨ Powered by Groq</span>
          </div>
          {insightsLoading ? (
            <div className="space-y-2"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
          ) : insightsError ? (
            <div className="card p-5 text-center">
              <p className="text-text-3 text-sm">{insightsError}</p>
              <button onClick={() => loadInsights(selectedMonth, expenses, total, budget.limit, 0)}
                className="text-primary text-sm font-semibold mt-2">Retry</button>
            </div>
          ) : insights.length === 0 ? (
            <div className="card p-5 text-center">
              <p className="text-text-3 text-sm">Add expenses to get AI-powered insights</p>
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
