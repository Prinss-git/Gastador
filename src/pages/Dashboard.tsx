import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useExpenses } from '../hooks/useExpenses'
import { useIncome } from '../hooks/useIncome'
import { useInsights } from '../hooks/useInsights'
import { useExpenseStore } from '../store/expenseStore'
import { useAuth } from '../hooks/useAuth'
import { MonthPicker } from '../components/MonthPicker'
import { ExpenseCard } from '../components/ExpenseCard'
import { InsightCard } from '../components/InsightCard'
import { SkeletonCard } from '../components/SkeletonLoader'
import { InstallBanner } from '../components/InstallBanner'
import { CATEGORY_EMOJIS, type Category } from '../constants/categories'

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function Dashboard() {
  const { user } = useAuth()
  const { expenses, deleteExpense } = useExpenses()
  const { income } = useIncome()
  const { selectedMonth } = useExpenseStore()
  const { insights, loading: insightsLoading, loadInsights } = useInsights()

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0)
  const totalIncome = income.reduce((s, e) => s + e.amount, 0)
  const hasIncome = totalIncome > 0
  const balance = totalIncome - totalSpent
  const pct = totalIncome > 0 ? Math.min((totalSpent / totalIncome) * 100, 100) : 0
  const [year, month] = selectedMonth.split('-').map(Number)

  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {}
    for (const e of expenses) map[e.category] = (map[e.category] ?? 0) + e.amount
    return Object.entries(map).sort((a, b) => b[1] - a[1]) as [Category, number][]
  }, [expenses])

  const total = totalSpent // keep alias for insights call below
  const recent = expenses.slice(0, 5)

  useEffect(() => {
    if (expenses.length > 0) loadInsights(selectedMonth, expenses, totalSpent, totalIncome, 0)
  }, [selectedMonth]) // eslint-disable-line

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const initial = user?.email?.slice(0, 1).toUpperCase() ?? 'G'

  return (
    <div className="pb-36 min-h-screen bg-bg animate-fade-in overflow-x-hidden">

      {/* ── Hero ── */}
      <div className="relative px-5 pt-14 pb-8 overflow-hidden">
        {/* Atmospheric orbs */}
        <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-10 w-48 h-48 rounded-full bg-coral/6 blur-3xl pointer-events-none" />

        {/* Top row */}
        <div className="relative flex items-center justify-between mb-8">
          <div>
            <p className="text-text-1 text-base font-semibold">{greeting}</p>
            <p className="text-text-3 text-xs mt-0.5">
              {new Date().toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Link to="/profile"
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm shadow-primary-sm">
            {initial}
          </Link>
        </div>

        {/* Balance */}
        <div className="relative mb-6">
          {hasIncome ? (
            <>
              <p className="text-text-3 text-xs font-medium mb-2">
                {balance >= 0 ? 'Remaining Balance' : 'Over Allowance'}
              </p>
              <p className={`font-bold tracking-tight ${balance < 0 ? 'text-danger' : 'text-text-1'}`}
                style={{ fontSize: 'clamp(2rem, 10vw, 3rem)' }}>
                {balance < 0 ? '-' : ''}₱{Math.abs(balance).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              {/* Income / Spent row */}
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0" />
                  <span className="text-text-3 text-xs">
                    ₱{totalIncome.toLocaleString('en-PH', { maximumFractionDigits: 0 })} in
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-danger flex-shrink-0" />
                  <span className="text-text-3 text-xs">
                    ₱{totalSpent.toLocaleString('en-PH', { maximumFractionDigits: 0 })} out
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-text-3 text-xs font-medium mb-2">Total Spent</p>
              <p className="text-text-1 font-bold tracking-tight" style={{ fontSize: 'clamp(2rem, 10vw, 3rem)' }}>
                ₱{totalSpent.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-text-3 text-xs mt-1.5">
                Tap + → Allowance to log your balance
              </p>
            </>
          )}
        </div>

        {/* Progress bar — shown when income is tracked */}
        {hasIncome && (
          <div className="relative">
            <div className="h-1.5 rounded-full bg-border overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: pct >= 100 ? '#F87171' : pct >= 80 ? '#FBBF24' : '#7C6FFF' }} />
            </div>
            <p className="text-text-3 text-xs mt-1.5 text-right">{pct.toFixed(0)}% spent</p>
          </div>
        )}
      </div>

      {/* ── Month picker ── */}
      <div className="flex items-center justify-between px-5 mb-5">
        <MonthPicker />
        <Link to="/add"
          className="text-xs font-semibold text-primary">
          + Add expense
        </Link>
      </div>

      {/* ── Category totals strip ── */}
      {categoryTotals.length > 0 && (
        <div className="flex gap-2 overflow-x-auto px-5 pb-1 mb-6 scrollbar-hide">
          {categoryTotals.map(([cat, amt]) => (
            <Link to="/history" key={cat}
              className="flex-shrink-0 flex items-center gap-2 bg-bg-elevated rounded-2xl px-3 py-2.5 border border-border">
              <span className="text-base">{CATEGORY_EMOJIS[cat]}</span>
              <div>
                <p className="text-text-1 text-xs font-semibold leading-none">
                  ₱{amt >= 1000 ? (amt / 1000).toFixed(1) + 'k' : amt.toFixed(0)}
                </p>
                <p className="text-text-3 text-[10px] mt-0.5 leading-none">{cat}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ── Install prompt ── */}
      <InstallBanner />

      {/* ── Recent transactions ── */}
      <div className="px-5 mb-2 flex items-center justify-between">
        <p className="text-text-1 text-sm font-semibold">Recent</p>
        <Link to="/history" className="text-primary text-xs font-medium">See all</Link>
      </div>

      {recent.length === 0 ? (
        <div className="mx-5 bg-bg-elevated rounded-2xl border border-border p-10 flex flex-col items-center text-center">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-text-1 font-semibold text-sm">No expenses yet</p>
          <p className="text-text-3 text-xs mt-1">Tap + to log your first one</p>
        </div>
      ) : (
        <div className="mx-5 bg-bg-elevated rounded-2xl border border-border overflow-hidden divide-y divide-border/50">
          {recent.map((e) => <ExpenseCard key={e.id} expense={e} onDelete={deleteExpense} />)}
        </div>
      )}

      {/* ── AI Insights (1–2 cards) ── */}
      {(insightsLoading || insights.length > 0) && (
        <div className="px-5 mt-6">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-text-1 text-sm font-semibold">AI Insights</p>
            <span className="text-[10px] text-text-3 font-medium bg-surface rounded-full px-2 py-0.5">Groq</span>
          </div>
          {insightsLoading ? (
            <div className="space-y-2"><SkeletonCard /><SkeletonCard /></div>
          ) : (
            <div className="space-y-2">
              {insights.slice(0, 2).map((ins, i) => <InsightCard key={i} insight={ins} />)}
              {insights.length > 2 && (
                <Link to="/insights" className="block text-center text-primary text-xs font-medium py-2">
                  See all insights →
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
