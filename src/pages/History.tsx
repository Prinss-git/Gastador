import { useState, useMemo } from 'react'
import { useExpenses } from '../hooks/useExpenses'
import { useIncome } from '../hooks/useIncome'
import { EditTransactionModal, type EditTarget } from '../components/EditTransactionModal'
import { useExpenseStore } from '../store/expenseStore'
import { ExpenseCard } from '../components/ExpenseCard'
import { MonthPicker } from '../components/MonthPicker'
import { CATEGORIES, type Category } from '../constants/categories'
import type { IncomeEntry } from '../store/expenseStore'

function IncomeRow({ entry, onDelete, onEdit }: { entry: IncomeEntry; onDelete: (id: string) => void; onEdit: (entry: IncomeEntry) => void }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 bg-bg-elevated" onClick={() => onEdit(entry)}>
      <div className="w-0.5 self-stretch rounded-full flex-shrink-0 my-0.5 bg-success" />
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-success/10">
        💰
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-text-1 font-medium text-sm truncate">{entry.description}</p>
        <p className="text-text-3 text-xs mt-0.5">Allowance · {entry.date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}</p>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-success font-semibold text-sm">+₱{entry.amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <button onClick={(e) => { e.stopPropagation(); onDelete(entry.id) }} className="text-text-3 hover:text-danger transition-colors p-1">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M9 6V4h6v2" />
          </svg>
        </button>
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-text-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  )
}

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
  const { expenses, deleteExpense, updateExpense } = useExpenses()
  const { income, deleteIncome, updateIncome } = useIncome()
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null)
  const { selectedMonth } = useExpenseStore()
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<Category | null>(null)

  const filteredExpenses = useMemo(() =>
    expenses.filter((e) => {
      const matchSearch = e.description.toLowerCase().includes(search.toLowerCase())
      const matchCat = !filterCategory || e.category === filterCategory
      return matchSearch && matchCat
    }), [expenses, search, filterCategory])

  const filteredIncome = useMemo(() =>
    !filterCategory
      ? income.filter((e) => e.description.toLowerCase().includes(search.toLowerCase()))
      : [], [income, search, filterCategory])

  // Merge into unified list with a type tag, sorted by date desc
  type Row =
    | { kind: 'expense'; data: typeof filteredExpenses[0] }
    | { kind: 'income'; data: typeof filteredIncome[0] }

  const allRows = useMemo((): Row[] => {
    const rows: Row[] = [
      ...filteredExpenses.map((e) => ({ kind: 'expense' as const, data: e })),
      ...filteredIncome.map((e) => ({ kind: 'income' as const, data: e })),
    ]
    return rows.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  }, [filteredExpenses, filteredIncome])

  const grouped = useMemo(() => {
    const groups: Record<string, Row[]> = {}
    for (const row of allRows) {
      const key = formatGroupDate(row.data.date)
      if (!groups[key]) groups[key] = []
      groups[key].push(row)
    }
    return groups
  }, [allRows])

  const totalSpent = filteredExpenses.reduce((s, e) => s + e.amount, 0)
  const totalIncome = filteredIncome.reduce((s, e) => s + e.amount, 0)

  return (
    <div className="pb-40 min-h-screen bg-bg overflow-x-hidden animate-fade-in">
      {/* Header */}
      <div className="px-5 pb-4" style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
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
            <p className="text-text-1 font-semibold text-sm">No entries found</p>
            <p className="text-text-3 text-xs mt-1">
              {search || filterCategory ? 'Try a different filter' : 'Add your first expense or allowance'}
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(([group, rows]) => (
            <div key={group}>
              <div className="flex items-center justify-between mb-2 px-1">
                <p className="text-text-3 text-xs font-semibold">{group}</p>
                <p className="text-text-3 text-xs">
                  {rows.some(r => r.kind === 'income') && (
                    <span className="text-success mr-2">
                      +₱{rows.filter(r => r.kind === 'income').reduce((s, r) => s + r.data.amount, 0).toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                    </span>
                  )}
                  -₱{rows.filter(r => r.kind === 'expense').reduce((s, r) => s + r.data.amount, 0).toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="bg-bg-elevated rounded-2xl border border-border overflow-hidden divide-y divide-border/50">
                {rows.map((row) =>
                  row.kind === 'expense' ? (
                    <ExpenseCard key={row.data.id} expense={row.data} onDelete={deleteExpense}
                      onEdit={(exp) => setEditTarget({ type: 'expense', data: exp })} />
                  ) : (
                    <IncomeRow key={row.data.id} entry={row.data} onDelete={deleteIncome}
                      onEdit={(entry) => setEditTarget({ type: 'income', data: entry })} />
                  )
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {editTarget && (
        <EditTransactionModal
          target={editTarget}
          onClose={() => setEditTarget(null)}
          updateExpense={updateExpense}
          updateIncome={updateIncome}
        />
      )}

      {/* Pinned summary bar */}
      {allRows.length > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-app px-5 pointer-events-none z-40">
          <div className="bg-bg-overlay/95 backdrop-blur-xl rounded-2xl border border-border py-3 px-4 flex items-center justify-between gap-2 shadow-large">
            <span className="text-text-3 text-xs">{allRows.length} entries</span>
            <div className="flex items-center gap-3">
              {totalIncome > 0 && (
                <span className="text-success text-xs font-semibold">
                  +₱{totalIncome.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                </span>
              )}
              <span className="text-danger text-xs font-semibold">
                -₱{totalSpent.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
              </span>
              {totalIncome > 0 && (
                <span className={`text-sm font-bold ${totalIncome - totalSpent >= 0 ? 'text-text-1' : 'text-danger'}`}>
                  = ₱{Math.abs(totalIncome - totalSpent).toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
