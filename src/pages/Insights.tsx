import { useEffect, useMemo } from 'react'
import { useExpenses } from '../hooks/useExpenses'
import { useInsights } from '../hooks/useInsights'
import { useExpenseStore } from '../store/expenseStore'
import { InsightCard } from '../components/InsightCard'
import { SkeletonCard } from '../components/SkeletonLoader'
import { CATEGORY_COLORS, type Category } from '../constants/categories'
import { MonthPicker } from '../components/MonthPicker'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function Insights() {
  const { expenses, budget } = useExpenses()
  const { selectedMonth } = useExpenseStore()
  const { insights, loading, error, loadInsights } = useInsights()
  const total = expenses.reduce((s, e) => s + e.amount, 0)
  const [year, month] = selectedMonth.split('-').map(Number)
  const monthName = MONTHS[month - 1]

  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {}
    for (const e of expenses) map[e.category] = (map[e.category] ?? 0) + e.amount
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [expenses])

  const biggestSplurge = useMemo(() =>
    expenses.reduce<typeof expenses[0] | null>((max, e) => (!max || e.amount > max.amount ? e : max), null),
    [expenses])

  useEffect(() => {
    if (expenses.length > 0) loadInsights(selectedMonth, expenses, total, budget.limit, 0)
  }, [selectedMonth]) // eslint-disable-line

  const pctUsed = budget.limit > 0 ? Math.min((total / budget.limit) * 100, 100) : 0

  return (
    <div className="pb-32 animate-fade-in bg-bg min-h-screen overflow-x-hidden">
      {/* Header */}
      <div className="px-5 pt-14 pb-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-text-1 text-xl font-bold">Insights</h1>
            <p className="text-text-3 text-xs mt-0.5">✨ Powered by Groq AI</p>
          </div>
          <MonthPicker />
        </div>

        {/* Summary hero */}
        <div className="bg-primary rounded-3xl p-5 shadow-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">{monthName} {year}</p>
          <p className="text-white text-4xl font-bold tracking-tight mb-1">
            ₱{total.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-white/60 text-sm">
            {budget.limit > 0 ? `${pctUsed.toFixed(0)}% of ₱${budget.limit.toLocaleString()} budget` : 'No budget set'}
          </p>
          <div className="mt-3 h-1.5 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full rounded-full bg-white/80 transition-all duration-700"
              style={{ width: `${pctUsed}%` }} />
          </div>
        </div>
      </div>

      <div className="px-5 space-y-4">
        {/* Category breakdown */}
        {categoryBreakdown.length > 0 && (
          <div className="card p-4">
            <p className="text-text-1 font-bold text-sm mb-4">Spending Breakdown</p>
            <div className="space-y-3.5">
              {categoryBreakdown.map(([cat, amt]) => {
                const pct = total > 0 ? (amt / total) * 100 : 0
                const color = CATEGORY_COLORS[cat as Category] ?? '#7C6FFF'
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-text-1 font-medium">{cat}</span>
                      <span className="text-text-2 font-semibold">
                        ₱{amt.toFixed(2)} <span className="text-text-3">· {pct.toFixed(0)}%</span>
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Biggest splurge */}
        {biggestSplurge && (
          <div className="card p-4 border-warning/30">
            <p className="section-label mb-3">💸 Biggest Splurge</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-1 font-bold">{biggestSplurge.description}</p>
                <p className="text-text-3 text-xs mt-0.5">
                  {biggestSplurge.date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })} · {biggestSplurge.category}
                </p>
              </div>
              <p className="text-warning font-bold text-lg">₱{biggestSplurge.amount.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* AI money tips */}
        <div>
          <p className="text-text-1 font-bold text-sm mb-3">AI Money Tips</p>
          {loading ? (
            <div className="space-y-2"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
          ) : error ? (
            <div className="card p-6 text-center">
              <p className="text-text-3 text-sm">{error}</p>
              <button onClick={() => loadInsights(selectedMonth, expenses, total, budget.limit, 0)}
                className="mt-3 text-primary text-sm font-bold px-4 py-2 rounded-xl bg-primary-bg">
                Try again
              </button>
            </div>
          ) : expenses.length === 0 ? (
            <div className="card p-8 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center text-2xl mb-3 animate-float">📊</div>
              <p className="text-text-1 font-semibold text-sm">Not enough data</p>
              <p className="text-text-3 text-xs mt-1">Add expenses to get AI insights</p>
            </div>
          ) : (
            <div className="space-y-2">
              {insights.map((ins, i) => <InsightCard key={i} insight={ins} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
