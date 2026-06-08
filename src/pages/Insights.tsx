import { useEffect, useMemo } from 'react'
import { useExpenses } from '../hooks/useExpenses'
import { useInsights } from '../hooks/useInsights'
import { useExpenseStore } from '../store/expenseStore'
import { InsightCard } from '../components/InsightCard'
import { SkeletonCard } from '../components/SkeletonLoader'
import { CATEGORY_COLORS, type Category } from '../constants/categories'
import { MonthPicker } from '../components/MonthPicker'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

export default function Insights() {
  const { expenses, budget } = useExpenses()
  const { selectedMonth } = useExpenseStore()
  const { insights, loading, error, loadInsights } = useInsights()

  const total = expenses.reduce((s, e) => s + e.amount, 0)

  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {}
    for (const e of expenses) {
      map[e.category] = (map[e.category] ?? 0) + e.amount
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [expenses])

  const biggestSplurge = useMemo(() => {
    return expenses.reduce<typeof expenses[0] | null>(
      (max, e) => (!max || e.amount > max.amount ? e : max),
      null
    )
  }, [expenses])

  const [year, month] = selectedMonth.split('-').map(Number)
  const monthName = MONTHS[month - 1]

  useEffect(() => {
    if (expenses.length > 0) {
      loadInsights(selectedMonth, expenses, total, budget.limit, 0)
    }
  }, [selectedMonth]) // eslint-disable-line react-hooks/exhaustive-deps

  const retry = () => loadInsights(selectedMonth, expenses, total, budget.limit, 0)

  return (
    <div className="pb-24 px-4 pt-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Insights</h1>
        <MonthPicker />
      </div>

      {/* Summary card */}
      <div className="bg-card rounded-2xl p-4">
        <p className="text-text-muted text-xs font-medium uppercase tracking-wider mb-2">
          {monthName} {year} Summary
        </p>
        <p className="text-3xl font-bold text-white mb-1">₱{total.toFixed(2)}</p>
        <p className="text-text-muted text-sm">
          {budget.limit > 0
            ? `${Math.round((total / budget.limit) * 100)}% of ₱${budget.limit.toFixed(0)} budget`
            : 'No budget set'}
        </p>
        {expenses.length === 0 && (
          <p className="text-text-muted text-sm mt-2">No expenses recorded this month.</p>
        )}
      </div>

      {/* Category breakdown */}
      {categoryBreakdown.length > 0 && (
        <div className="bg-card rounded-2xl p-4">
          <p className="text-white font-semibold mb-3">By Category</p>
          <div className="space-y-3">
            {categoryBreakdown.map(([cat, amt]) => {
              const pct = total > 0 ? (amt / total) * 100 : 0
              const color = CATEGORY_COLORS[cat as Category] ?? '#6C63FF'
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white">{cat}</span>
                    <span className="text-text-muted">₱{amt.toFixed(2)} · {pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Biggest splurge */}
      {biggestSplurge && (
        <div className="bg-card rounded-2xl p-4 border border-yellow-500/20">
          <p className="text-text-muted text-xs font-medium uppercase tracking-wider mb-2">💸 Biggest Splurge</p>
          <p className="text-white font-semibold">{biggestSplurge.description}</p>
          <p className="text-yellow-400 text-xl font-bold mt-1">
            ₱{biggestSplurge.amount.toFixed(2)}
          </p>
          <p className="text-text-muted text-xs mt-1">
            {biggestSplurge.date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })} · {biggestSplurge.category}
          </p>
        </div>
      )}

      {/* AI Insights */}
      <div>
        <p className="text-white font-semibold mb-3">✨ AI Money Tips</p>
        {loading ? (
          <div className="space-y-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : error ? (
          <div className="bg-card rounded-2xl p-6 text-center">
            <p className="text-4xl mb-3">🤖</p>
            <p className="text-text-muted text-sm">{error}</p>
            <button onClick={retry} className="mt-3 text-primary text-sm font-medium">
              Try again
            </button>
          </div>
        ) : expenses.length === 0 ? (
          <div className="bg-card rounded-2xl p-6 text-center">
            <p className="text-4xl mb-3">📊</p>
            <p className="text-white font-medium">Not enough data</p>
            <p className="text-text-muted text-sm mt-1">Add expenses to get AI insights</p>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((ins, i) => (
              <InsightCard key={i} insight={ins} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
