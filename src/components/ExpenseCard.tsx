import { useState, useRef } from 'react'
import { CATEGORY_COLORS, CATEGORY_EMOJIS } from '../constants/categories'
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
  const color = CATEGORY_COLORS[expense.category] ?? '#8888A8'
  const emoji = CATEGORY_EMOJIS[expense.category] ?? '📦'

  return (
    <div className="relative overflow-hidden">
      {/* Delete action behind */}
      {onDelete && (
        <button
          onClick={() => { onDelete(expense.id); setSwiped(false) }}
          className="absolute right-0 inset-y-0 w-20 bg-danger flex flex-col items-center justify-center text-white text-xs font-semibold gap-0.5">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
          </svg>
          Delete
        </button>
      )}

      {/* Row content */}
      <div
        className="flex items-center gap-3 px-4 py-3.5 bg-bg-elevated transition-transform duration-200"
        style={{ transform: swiped ? 'translateX(-80px)' : 'translateX(0)' }}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
        onTouchEnd={(e) => {
          const dx = touchStartX.current - e.changedTouches[0].clientX
          if (dx > 50) setSwiped(true)
          if (dx < -20) setSwiped(false)
        }}
      >
        {/* Left color accent */}
        <div className="w-0.5 self-stretch rounded-full flex-shrink-0 my-0.5"
          style={{ backgroundColor: color }} />

        {/* Icon */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ backgroundColor: `${color}15` }}>
          {emoji}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-text-1 font-medium text-sm truncate">{expense.description}</p>
          <p className="text-text-3 text-xs mt-0.5">
            {expense.category}{showDate ? ` · ${formatDate(expense.date)}` : ` · ${formatDate(expense.date)}`}
          </p>
        </div>

        {/* Amount */}
        <p className="text-text-1 font-semibold text-sm flex-shrink-0">
          -₱{expense.amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  )
}
