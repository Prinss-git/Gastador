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
  return date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
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
    <div className="pb-36 animate-fade-in bg-bg min-h-screen overflow-x-hidden">
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-text-1 text-xl font-bold">History</h1>
          <MonthPicker />
        </div>

        {/* Search */}
        <div className="card px-4 py-3 flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-text-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expenses…"
            className="flex-1 bg-transparent text-text-1 text-sm outline-none placeholder:text-text-3" />
          {search && (
            <button onClick={() => setSearch('')}
              className="w-5 h-5 rounded-full bg-surface flex items-center justify-center text-text-3 text-xs hover:text-text-1">✕</button>
          )}
        </div>
      </div>

      <div className="px-5 space-y-4">
        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button onClick={() => setFilterCategory(null)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150 ${
              !filterCategory ? 'bg-primary text-white' : 'bg-surface text-text-3 border border-border hover:border-border-light'
            }`}>
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150 ${
                filterCategory === cat ? 'bg-primary text-white' : 'bg-surface text-text-3 border border-border hover:border-border-light'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grouped list */}
        {Object.keys(grouped).length === 0 ? (
          <div className="card p-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center text-2xl mb-3 animate-float">📭</div>
            <p className="text-text-1 font-semibold text-sm">No expenses found</p>
            <p className="text-text-3 text-xs mt-1">
              {search || filterCategory ? 'Try a different filter' : 'Add your first expense!'}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {Object.entries(grouped).map(([group, items]) => (
              <div key={group}>
                <div className="flex items-center justify-between mb-2 px-1">
                  <p className="section-label">{group}</p>
                  <p className="text-text-2 text-xs font-bold">
                    ₱{items.reduce((s, e) => s + e.amount, 0).toFixed(2)}
                  </p>
                </div>
                <div className="space-y-2">
                  {items.map((e) => <ExpenseCard key={e.id} expense={e} onDelete={deleteExpense} />)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pinned total bar */}
      {filtered.length > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-app px-5 pointer-events-none z-40">
          <div className="bg-primary rounded-2xl py-3 px-5 flex justify-between items-center shadow-primary">
            <span className="text-white/80 text-sm font-semibold">
              {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
            </span>
            <span className="text-white font-bold">₱{total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
