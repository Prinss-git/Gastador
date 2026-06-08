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
  onEdit?: (expense: Expense) => void
  showDate?: boolean
}

export function ExpenseCard({ expense, onDelete, onEdit, showDate = false }: Props) {
  const [swiped, setSwiped] = useState(false)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const didSwipe = useRef(false)
  const color = CATEGORY_COLORS[expense.category] ?? '#8888A8'
  const emoji = CATEGORY_EMOJIS[expense.category] ?? '📦'

  return (
    <div className="relative overflow-hidden">
      {/* Actions revealed on swipe */}
      {(onDelete || onEdit) && (
        <div className="absolute right-0 inset-y-0 flex">
          {onEdit && (
            <button
              onClick={() => { onEdit(expense); setSwiped(false) }}
              className="w-16 bg-primary/80 flex flex-col items-center justify-center text-white text-xs font-semibold gap-0.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => { onDelete(expense.id); setSwiped(false) }}
              className="w-16 bg-danger flex flex-col items-center justify-center text-white text-xs font-semibold gap-0.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
              </svg>
              Delete
            </button>
          )}
        </div>
      )}

      {/* Row content */}
      <div
        className="flex items-center gap-3 px-4 py-3.5 bg-bg-elevated transition-transform duration-200"
        style={{ transform: swiped ? `translateX(${onEdit && onDelete ? -128 : -64}px)` : 'translateX(0)' }}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX
          touchStartY.current = e.touches[0].clientY
          didSwipe.current = false
        }}
        onTouchEnd={(e) => {
          const dx = touchStartX.current - e.changedTouches[0].clientX
          const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY)
          if (dx > 40 && dy < 30) { setSwiped(true); didSwipe.current = true }
          if (dx < -20) setSwiped(false)
        }}
        onClick={() => {
          if (didSwipe.current) return
          if (swiped) { setSwiped(false); return }
          onEdit?.(expense)
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
            {expense.category} · {formatDate(expense.date)}
          </p>
        </div>

        {/* Amount + edit hint */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <p className="text-text-1 font-semibold text-sm">
            -₱{expense.amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          {onEdit && (
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-text-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}
