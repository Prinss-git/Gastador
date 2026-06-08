import { useState, useRef } from 'react'
import { CategoryBadge } from './CategoryBadge'
import { CATEGORY_COLORS } from '../constants/categories'
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
  const color = CATEGORY_COLORS[expense.category]

  const EMOJIS: Record<string, string> = {
    Food: '🍔', Transport: '🚌', Shopping: '🛍️',
    Bills: '💡', Health: '💊', Entertainment: '🎮', Others: '📦',
  }

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {onDelete && (
        <button onClick={() => onDelete(expense.id)}
          className="absolute right-0 top-0 h-full w-20 bg-danger flex flex-col items-center justify-center text-white text-xs font-bold gap-1 transition-all">
          <span className="text-lg">🗑️</span>Delete
        </button>
      )}
      <div
        className="relative bg-card border border-border/40 p-4 flex items-center gap-3 transition-all duration-300 hover:bg-card-hover hover:border-border"
        style={{ transform: swiped ? 'translateX(-80px)' : 'translateX(0)' }}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
        onTouchEnd={(e) => {
          const dx = touchStartX.current - e.changedTouches[0].clientX
          if (dx > 60) setSwiped(true)
          if (dx < -20) setSwiped(false)
        }}
        onContextMenu={(e) => { e.preventDefault(); setSwiped(true) }}
      >
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ backgroundColor: `${color}18`, border: `1px solid ${color}25` }}>
          {EMOJIS[expense.category] ?? '📦'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-text-primary font-semibold truncate text-sm">{expense.description}</p>
          <div className="flex items-center gap-2 mt-1">
            <CategoryBadge category={expense.category} size="sm" />
            {showDate && <span className="text-text-muted text-xs">{formatDate(expense.date)}</span>}
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-text-primary font-bold">₱{expense.amount.toFixed(2)}</p>
          {!showDate && <p className="text-text-muted text-xs mt-0.5">{formatDate(expense.date)}</p>}
        </div>
      </div>
    </div>
  )
}
