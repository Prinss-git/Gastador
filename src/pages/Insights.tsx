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
  const budgetColor = pctUsed >= 90 ? '#EF4444' : pctUsed >= 70 ? '#F59E0B' : '#10B981'

  return (
    <div className="pb-32 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden px-4 pt-12 pb-5"
        style={{ background: 'linear-gradient(180deg, rgba(255,107,157,0.08) 0%, transparent 100%)' }}>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-text-primary">Insights ✨</h1>
          <MonthPicker />
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Summary hero */}
        <div className="rounded-2xl p-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%)' }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 50%)' }} />
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">{monthName} {year}</p>
          <p className="text-4xl font-bold text-white mb-1">₱{total.toFixed(2)}</p>
          <p className="text-white/70 text-sm">
            {budget.limit > 0 ? `${pctUsed.toFixed(0)}% of ₱${budget.limit.toFixed(0)} budget` : 'No budget set'}
          </p>
          <div className="mt-3 h-1.5 rounded-full bg-white/20">
            <div className="h-full rounded-full bg-white transition-all duration-700"
              style={{ width: `${pctUsed}%` }} />
          </div>
        </div>

        {/* Category breakdown */}
        {categoryBreakdown.length > 0 && (
          <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-card">
            <p className="text-text-primary font-bold text-sm mb-4">Spending Breakdown</p>
            <div className="space-y-3">
              {categoryBreakdown.map(([cat, amt]) => {
                const pct = total > 0 ? (amt / total) * 100 : 0
                const color = CATEGORY_COLORS[cat as Category] ?? '#6C63FF'
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-text-primary font-medium">{cat}</span>
                      <span className="text-text-secondary font-semibold">₱{amt.toFixed(2)} <span className="text-text-muted">· {pct.toFixed(0)}%</span></span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 6px ${color}50` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Biggest splurge */}
        {biggestSplurge && (
          <div className="bg-card rounded-2xl p-4 border border-warning/20 shadow-card">
            <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-3">💸 Biggest Splurge</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-primary font-bold">{biggestSplurge.description}</p>
                <p className="text-text-muted text-xs mt-0.5">
                  {biggestSplurge.date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })} · {biggestSplurge.category}
                </p>
              </div>
              <p className="text-warning font-bold text-xl">₱{biggestSplurge.amount.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* AI money tips */}
        <div>
          <p className="text-text-primary font-bold text-sm mb-3">🤖 AI Money Tips</p>
          {loading ? (
            <div className="space-y-3"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
          ) : error ? (
            <div className="bg-card rounded-2xl p-6 text-center border border-border/50">
              <p className="text-4xl mb-3">🤖</p>
              <p className="text-text-muted text-sm">{error}</p>
              <button onClick={() => loadInsights(selectedMonth, expenses, total, budget.limit, 0)}
                className="mt-3 text-primary font-bold text-sm px-4 py-2 rounded-xl bg-primary/10">
                Try again
              </button>
            </div>
          ) : expenses.length === 0 ? (
            <div className="bg-card rounded-2xl p-8 text-center border border-border/50">
              <p className="text-4xl mb-3 animate-float">📊</p>
              <p className="text-text-primary font-semibold">Not enough data</p>
              <p className="text-text-muted text-sm mt-1">Add expenses to get AI insights</p>
            </div>
          ) : (
            <div className="space-y-3">
              {insights.map((ins, i) => <InsightCard key={i} insight={ins} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
