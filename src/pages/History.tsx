import { useState, useMemo } from 'react'
import { useExpenses } from '../hooks/useExpenses'
import { useExpenseStore } from '../store/expenseStore'
import { ExpenseCard } from '../components/ExpenseCard'
import { MonthPicker } from '../components/MonthPicker'
import { CATEGORIES, type Category } from '../constants/categories'

function formatGroupDate(date: Date): string {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diff = (today.getTime() - d.getTime()) / 86400000
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return date.toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function History() {
  const { expenses, deleteExpense } = useExpenses()
  const { selectedMonth } = useExpenseStore()
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<Category | null>(null)

  const filtered = useMemo(() =>
    expenses.filter((e) => {
      const matchSearch = e.description.toLowerCase().includes(search.toLowerCase())
      const matchCat = !filterCategory || e.category === filterCategory
      return matchSearch && matchCat
    }), [expenses, search, filterCategory])

  const grouped = useMemo(() => {
    const groups: Record<string, typeof filtered> = {}
    for (const e of filtered) {
      const key = formatGroupDate(e.date)
      if (!groups[key]) groups[key] = []
      groups[key].push(e)
    }
    return groups
  }, [filtered])

  const total = filtered.reduce((s, e) => s + e.amount, 0)

  return (
    <div className="pb-40 min-h-screen bg-bg overflow-x-hidden animate-fade-in">
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-text-1 text-xl font-bold">History</h1>
          <MonthPicker />
        </div>

        {/* Search */}
        <div className="flex items-center gap-2.5 bg-bg-elevated rounded-2xl border border-border px-4 py-3">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-text-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expenses…"
            className="flex-1 bg-transparent text-text-1 text-sm outline-none placeholder:text-text-3 min-w-0" />
          {search && (
            <button onClick={() => setSearch('')} className="text-text-3 hover:text-text-2 transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category filter strip */}
      <div className="flex gap-2 overflow-x-auto px-5 pb-1 mb-4 scrollbar-hide">
        <button onClick={() => setFilterCategory(null)}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
            !filterCategory
              ? 'bg-primary text-white'
              : 'bg-bg-elevated text-text-3 border border-border hover:border-border-light'
          }`}>
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
              filterCategory === cat
                ? 'bg-primary text-white'
                : 'bg-bg-elevated text-text-3 border border-border hover:border-border-light'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grouped list */}
      <div className="px-5 space-y-5">
        {Object.keys(grouped).length === 0 ? (
          <div className="bg-bg-elevated rounded-2xl border border-border p-10 flex flex-col items-center text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-text-1 font-semibold text-sm">No expenses found</p>
            <p className="text-text-3 text-xs mt-1">
              {search || filterCategory ? 'Try a different filter' : 'Add your first expense'}
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              {/* Date group header */}
              <div className="flex items-center justify-between mb-2 px-1">
                <p className="text-text-3 text-xs font-semibold">{group}</p>
                <p className="text-text-3 text-xs">
                  ₱{items.reduce((s, e) => s + e.amount, 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              {/* Rows */}
              <div className="bg-bg-elevated rounded-2xl border border-border overflow-hidden divide-y divide-border/50">
                {items.map((e) => <ExpenseCard key={e.id} expense={e} onDelete={deleteExpense} />)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pinned total bar */}
      {filtered.length > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-app px-5 pointer-events-none z-40">
          <div className="bg-bg-overlay/95 backdrop-blur-xl rounded-2xl border border-border py-3 px-5 flex justify-between items-center shadow-large">
            <span className="text-text-2 text-sm font-medium">
              {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
            </span>
            <span className="text-text-1 font-bold text-sm">
              ₱{total.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
