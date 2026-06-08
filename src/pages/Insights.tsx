import { useEffect, useMemo } from 'react'
import { useExpenses } from '../hooks/useExpenses'
import { useInsights } from '../hooks/useInsights'
import { useExpenseStore } from '../store/expenseStore'
import { InsightCard } from '../components/InsightCard'
import { SkeletonCard } from '../components/SkeletonLoader'
import { CATEGORY_COLORS, CATEGORY_EMOJIS, type Category } from '../constants/categories'
import { MonthPicker } from '../components/MonthPicker'
import { DailyBarChart } from '../components/SpendingChart'

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function Insights() {
  const { expenses, budget } = useExpenses()
  const { selectedMonth } = useExpenseStore()
  const { insights, loading, error, loadInsights } = useInsights()

  const total = expenses.reduce((s, e) => s + e.amount, 0)
  const [year, month] = selectedMonth.split('-').map(Number)
  const pctUsed = budget.limit > 0 ? Math.min((total / budget.limit) * 100, 100) : 0

  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {}
    for (const e of expenses) map[e.category] = (map[e.category] ?? 0) + e.amount
    return Object.entries(map).sort((a, b) => b[1] - a[1]) as [Category, number][]
  }, [expenses])

  const biggestSplurge = useMemo(() =>
    expenses.reduce<typeof expenses[0] | null>((max, e) => (!max || e.amount > max.amount ? e : max), null),
    [expenses])

  useEffect(() => {
    if (expenses.length > 0) loadInsights(selectedMonth, expenses, total, budget.limit, 0)
  }, [selectedMonth]) // eslint-disable-line

  return (
    <div className="pb-32 min-h-screen bg-bg overflow-x-hidden animate-fade-in">
      {/* Header */}
      <div className="px-5 pt-14 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-text-1 text-xl font-bold">Insights</h1>
            <p className="text-text-3 text-xs mt-0.5">{MONTH_NAMES[month - 1]} {year}</p>
          </div>
          <MonthPicker />
        </div>

        {/* Quick summary row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Spent', value: `₱${total >= 1000 ? (total / 1000).toFixed(1) + 'k' : total.toFixed(0)}` },
            { label: 'Transactions', value: String(expenses.length) },
            { label: 'Avg/day', value: expenses.length > 0 ? `₱${(total / 30).toFixed(0)}` : '—' },
          ].map((s) => (
            <div key={s.label} className="bg-bg-elevated rounded-2xl border border-border px-3 py-3 text-center">
              <p className="text-text-1 font-bold text-base">{s.value}</p>
              <p className="text-text-3 text-[10px] mt-0.5 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 space-y-5">
        {/* Budget progress */}
        {budget.limit > 0 && (
          <div className="bg-bg-elevated rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-text-1 text-sm font-semibold">Budget</p>
              <span className={`text-xs font-semibold ${pctUsed >= 90 ? 'text-danger' : pctUsed >= 70 ? 'text-warning' : 'text-success'}`}>
                {pctUsed.toFixed(0)}% used
              </span>
            </div>
            <div className="h-2 rounded-full bg-border overflow-hidden mb-2">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pctUsed}%`, backgroundColor: pctUsed >= 90 ? '#F87171' : pctUsed >= 70 ? '#FBBF24' : '#7C6FFF' }} />
            </div>
            <div className="flex justify-between text-xs text-text-3">
              <span>₱{total.toLocaleString('en-PH', { maximumFractionDigits: 0 })} spent</span>
              <span>₱{budget.limit.toLocaleString()} budget</span>
            </div>
          </div>
        )}

        {/* Category breakdown — CSS bars, no Recharts */}
        {categoryBreakdown.length > 0 && (
          <div className="bg-bg-elevated rounded-2xl border border-border p-4">
            <p className="text-text-1 text-sm font-semibold mb-4">By Category</p>
            <div className="space-y-4">
              {categoryBreakdown.map(([cat, amt]) => {
                const pct = total > 0 ? (amt / total) * 100 : 0
                const color = CATEGORY_COLORS[cat] ?? '#7C6FFF'
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{CATEGORY_EMOJIS[cat]}</span>
                        <span className="text-text-1 text-sm font-medium">{cat}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-text-1 text-sm font-semibold">
                          ₱{amt.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                        </span>
                        <span className="text-text-3 text-xs ml-1.5">{pct.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-border overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Daily chart */}
        {expenses.length > 0 && (
          <div className="bg-bg-elevated rounded-2xl border border-border p-4">
            <p className="text-text-1 text-sm font-semibold mb-3">Daily Spending</p>
            <DailyBarChart expenses={expenses} month={selectedMonth} />
          </div>
        )}

        {/* Biggest single expense */}
        {biggestSplurge && (
          <div className="bg-bg-elevated rounded-2xl border border-border p-4">
            <p className="text-text-3 text-xs font-semibold mb-3">Largest Expense</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-1 font-semibold text-sm">{biggestSplurge.description}</p>
                <p className="text-text-3 text-xs mt-0.5">
                  {biggestSplurge.category} · {biggestSplurge.date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <p className="text-warning font-bold text-base">
                ₱{biggestSplurge.amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        )}

        {/* AI tips */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-text-1 text-sm font-semibold">AI Tips</p>
            <span className="text-[10px] text-text-3 font-medium bg-bg-elevated rounded-full px-2 py-0.5 border border-border">Groq · Llama 3</span>
          </div>
          {loading ? (
            <div className="space-y-2"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
          ) : error ? (
            <div className="bg-bg-elevated rounded-2xl border border-border p-6 text-center">
              <p className="text-text-3 text-sm">{error}</p>
              <button onClick={() => loadInsights(selectedMonth, expenses, total, budget.limit, 0)}
                className="mt-3 text-primary text-sm font-semibold">
                Try again
              </button>
            </div>
          ) : expenses.length === 0 ? (
            <div className="bg-bg-elevated rounded-2xl border border-border p-8 text-center">
              <p className="text-text-1 font-semibold text-sm">No data yet</p>
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
