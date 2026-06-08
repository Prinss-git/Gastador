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

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      const matchSearch = e.description.toLowerCase().includes(search.toLowerCase())
      const matchCat = !filterCategory || e.category === filterCategory
      return matchSearch && matchCat
    })
  }, [expenses, search, filterCategory])

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
    <div className="pb-28 px-4 pt-6 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-white">History</h1>
        <MonthPicker />
      </div>

      {/* Search */}
      <div className="bg-card rounded-xl px-4 py-3 flex items-center gap-2 mb-4">
        <span className="text-text-muted text-sm">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search expenses…"
          className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-text-muted"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-text-muted text-sm">✕</button>
        )}
      </div>

      {/* Category filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        <button
          onClick={() => setFilterCategory(null)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            !filterCategory ? 'bg-primary text-white' : 'bg-card text-text-muted'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filterCategory === cat ? 'bg-primary text-white' : 'bg-card text-text-muted'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grouped expenses */}
      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-white font-medium">No expenses found</p>
          <p className="text-text-muted text-sm mt-1">
            {search || filterCategory ? 'Try a different filter' : 'Add your first expense!'}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-text-muted text-xs font-medium uppercase tracking-wider">{group}</p>
                <p className="text-text-muted text-xs">
                  ₱{items.reduce((s, e) => s + e.amount, 0).toFixed(2)}
                </p>
              </div>
              <div className="space-y-2">
                {items.map((e) => (
                  <ExpenseCard key={e.id} expense={e} onDelete={deleteExpense} showDate={false} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pinned total */}
      {filtered.length > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-app px-4 pointer-events-none">
          <div className="bg-primary rounded-xl py-2.5 px-4 flex justify-between items-center shadow-lg">
            <span className="text-white text-sm font-medium">
              {filtered.length} expense{filtered.length !== 1 ? 's' : ''}
            </span>
            <span className="text-white font-bold">₱{total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
