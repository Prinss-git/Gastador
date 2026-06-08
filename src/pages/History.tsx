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
    <div className="pb-36 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden px-4 pt-12 pb-5"
        style={{ background: 'linear-gradient(180deg, rgba(108,99,255,0.1) 0%, transparent 100%)' }}>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-text-primary">History</h1>
          <MonthPicker />
        </div>
      </div>

      <div className="px-4 space-y-3">
        {/* Search */}
        <div className="bg-card rounded-2xl px-4 py-3 flex items-center gap-2 border border-border/50">
          <span className="text-text-muted">🔍</span>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expenses…"
            className="flex-1 bg-transparent text-text-primary text-sm outline-none placeholder:text-text-muted" />
          {search && (
            <button onClick={() => setSearch('')}
              className="w-5 h-5 rounded-full bg-border flex items-center justify-center text-text-muted text-xs">✕</button>
          )}
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button onClick={() => setFilterCategory(null)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              !filterCategory ? 'text-white shadow-glow-sm' : 'bg-card text-text-muted border border-border/50'
            }`}
            style={!filterCategory ? { background: 'linear-gradient(135deg, #6C63FF, #8B85FF)' } : {}}>
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                filterCategory === cat ? 'text-white shadow-glow-sm' : 'bg-card text-text-muted border border-border/50'
              }`}
              style={filterCategory === cat ? { background: 'linear-gradient(135deg, #6C63FF, #8B85FF)' } : {}}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grouped list */}
        {Object.keys(grouped).length === 0 ? (
          <div className="bg-card rounded-2xl p-10 text-center border border-border/50">
            <p className="text-4xl mb-3 animate-float">📭</p>
            <p className="text-text-primary font-semibold">No expenses found</p>
            <p className="text-text-muted text-sm mt-1">
              {search || filterCategory ? 'Try a different filter' : 'Add your first expense!'}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {Object.entries(grouped).map(([group, items]) => (
              <div key={group}>
                <div className="flex items-center justify-between mb-2 px-1">
                  <p className="text-text-muted text-xs font-bold uppercase tracking-widest">{group}</p>
                  <p className="text-text-secondary text-xs font-bold">
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
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-app px-4 pointer-events-none z-40">
          <div className="rounded-2xl py-3 px-5 flex justify-between items-center shadow-glow"
            style={{ background: 'linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%)' }}>
            <span className="text-white text-sm font-semibold">
              {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
            </span>
            <span className="text-white font-bold text-lg">₱{total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
