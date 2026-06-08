import { useState, useRef } from 'react'
import { CategoryBadge } from './CategoryBadge'
import type { Expense } from '../store/expenseStore'

function formatDate(date: Date): string {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diff = (today.getTime() - d.getTime()) / 86400000
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
}

interface Props {
  expense: Expense
  onDelete?: (id: string) => void
  showDate?: boolean
}

export function ExpenseCard({ expense, onDelete, showDate = false }: Props) {
  const [swiped, setSwiped] = useState(false)
  const touchStartX = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX
    if (dx > 60) setSwiped(true)
    if (dx < -20) setSwiped(false)
  }

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Delete button revealed on swipe */}
      {onDelete && (
        <button
          onClick={() => onDelete(expense.id)}
          className="absolute right-0 top-0 h-full w-20 bg-red-500 flex items-center justify-center text-white font-medium text-sm"
        >
          Delete
        </button>
      )}
      <div
        className="relative bg-card p-4 flex items-center gap-3 transition-transform duration-200"
        style={{ transform: swiped ? 'translateX(-80px)' : 'translateX(0)' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onContextMenu={(e) => { e.preventDefault(); setSwiped(true) }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
          style={{ backgroundColor: '#1A1A2E' }}
        >
          {/* category emoji */}
          {expense.category === 'Food' && '🍔'}
          {expense.category === 'Transport' && '🚌'}
          {expense.category === 'Shopping' && '🛍️'}
          {expense.category === 'Bills' && '💡'}
          {expense.category === 'Health' && '💊'}
          {expense.category === 'Entertainment' && '🎮'}
          {expense.category === 'Others' && '📦'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium truncate">{expense.description}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <CategoryBadge category={expense.category} size="sm" />
            {showDate && (
              <span className="text-text-muted text-xs">{formatDate(expense.date)}</span>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-white font-semibold">₱{expense.amount.toFixed(2)}</p>
          {!showDate && (
            <p className="text-text-muted text-xs">{formatDate(expense.date)}</p>
          )}
        </div>
      </div>
    </div>
  )
}
