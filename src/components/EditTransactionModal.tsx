import { useState } from 'react'
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_EMOJIS, type Category } from '../constants/categories'
import type { Expense, IncomeEntry } from '../store/expenseStore'

function formatDisplay(s: string): string {
  if (!s) return '0'
  const [intPart, decPart] = s.split('.')
  const formatted = parseInt(intPart || '0', 10).toLocaleString('en-PH')
  return decPart !== undefined ? `${formatted}.${decPart}` : formatted
}

const KEYS = [['7', '8', '9'], ['4', '5', '6'], ['1', '2', '3'], ['.', '0', '⌫']]

export type EditTarget =
  | { type: 'expense'; data: Expense }
  | { type: 'income'; data: IncomeEntry }

interface Props {
  target: EditTarget | null
  onClose: () => void
  updateExpense: (id: string, data: Partial<Omit<Expense, 'id'>>) => Promise<void>
  updateIncome: (id: string, data: Partial<Omit<IncomeEntry, 'id'>>) => Promise<void>
}

export function EditTransactionModal({ target, onClose, updateExpense, updateIncome }: Props) {
  const isExpense = target?.type === 'expense'
  const initial = target?.data

  const [amountStr, setAmountStr] = useState(initial ? String(initial.amount) : '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [category, setCategory] = useState<Category | null>(
    target?.type === 'expense' ? target.data.category : null
  )
  const [date, setDate] = useState(
    initial ? initial.date.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
  )
  const [showCatPicker, setShowCatPicker] = useState(false)
  const [saving, setSaving] = useState(false)

  function handleKey(key: string) {
    setAmountStr(prev => {
      if (key === '⌫') return prev.slice(0, -1)
      if (key === '.') {
        if (prev.includes('.')) return prev
        return (prev || '0') + '.'
      }
      if (prev.includes('.')) {
        const dec = prev.split('.')[1] ?? ''
        if (dec.length >= 2) return prev
      }
      if (prev === '0') return key
      if (prev.replace('.', '').length >= 9) return prev
      return prev + key
    })
  }

  const handleSave = async () => {
    if (!target) return
    const amount = parseFloat(amountStr) || 0
    if (!description.trim() || amount <= 0) return
    setSaving(true)
    try {
      if (target.type === 'expense') {
        await updateExpense(target.data.id, {
          description: description.trim(),
          amount: parseFloat(amount.toFixed(2)),
          category: category ?? 'Others',
          date: new Date(date + 'T12:00:00'),
        })
      } else {
        await updateIncome(target.data.id, {
          description: description.trim(),
          amount: parseFloat(amount.toFixed(2)),
          date: new Date(date + 'T12:00:00'),
        })
      }
      onClose()
    } catch {
      setSaving(false)
    }
  }

  if (!target) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative w-full max-w-app mx-auto bg-bg-overlay rounded-t-3xl border-t border-border"
        onClick={e => e.stopPropagation()}>

        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-border mx-auto mt-3 mb-2" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/50">
          <p className="text-text-1 font-semibold text-sm">
            Edit {isExpense ? 'Expense' : 'Allowance'}
          </p>
          <button onClick={onClose} className="text-text-3 hover:text-text-1 transition-colors p-1">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Amount display */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-xl font-semibold ${isExpense ? 'text-primary' : 'text-success'}`}>
              {isExpense ? '₱' : '+₱'}
            </span>
            <span className={`font-bold tracking-tight ${amountStr ? 'text-text-1' : 'text-text-3'}`}
              style={{ fontSize: 'clamp(1.75rem, 9vw, 2.5rem)' }}>
              {formatDisplay(amountStr)}
            </span>
          </div>
        </div>

        {/* Fields */}
        <div className="px-5 space-y-2 mb-3">
          <div className="bg-surface rounded-2xl border border-border px-4 py-2.5">
            <input type="text" value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full bg-transparent text-text-1 text-sm outline-none placeholder:text-text-3" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {isExpense ? (
              <button onClick={() => setShowCatPicker(true)}
                className="bg-surface rounded-2xl border border-border px-4 py-2.5 text-left flex items-center gap-2">
                <span className="text-base">{category ? CATEGORY_EMOJIS[category] : '📦'}</span>
                <span className="text-text-1 text-sm truncate">{category ?? 'Select…'}</span>
              </button>
            ) : (
              <div className="bg-surface rounded-2xl border border-border px-4 py-2.5 flex items-center gap-2">
                <span className="text-success text-base">💰</span>
                <span className="text-text-2 text-sm">Allowance</span>
              </div>
            )}

            <div className="bg-surface rounded-2xl border border-border px-4 py-2.5">
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                max={new Date().toISOString().slice(0, 10)}
                className="w-full bg-transparent text-text-1 text-sm outline-none" />
            </div>
          </div>
        </div>

        {/* Numpad */}
        <div className="px-4 pb-2">
          <div className="grid grid-cols-3 gap-1.5">
            {KEYS.flat().map(key => (
              <button key={key} onPointerDown={() => handleKey(key)}
                className="py-3 flex items-center justify-center rounded-2xl bg-surface border border-border
                           text-text-1 font-semibold text-3xl
                           transition-all duration-75 active:scale-95 active:bg-bg-elevated select-none">
                {key === '⌫' ? (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z" />
                    <line x1="18" y1="9" x2="14" y2="13" /><line x1="14" y1="9" x2="18" y2="13" />
                  </svg>
                ) : key}
              </button>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="px-5 pb-10 pt-2">
          <button onClick={handleSave} disabled={saving}
            className={`w-full py-4 rounded-2xl font-semibold text-white text-sm transition-all active:scale-[0.98] disabled:opacity-60 ${
              isExpense ? 'bg-primary shadow-primary' : 'bg-success/80 hover:bg-success'
            }`}>
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </span>
            ) : 'Save Changes'}
          </button>
        </div>

        {/* Category picker overlay */}
        {showCatPicker && (
          <div className="absolute inset-0 bg-bg-overlay rounded-t-3xl flex flex-col p-5"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-text-1 font-semibold text-sm">Choose Category</p>
              <button onClick={() => setShowCatPicker(false)} className="text-text-3 hover:text-text-1 transition-colors">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 overflow-y-auto">
              {CATEGORIES.map(cat => {
                const c = CATEGORY_COLORS[cat]
                const selected = category === cat
                return (
                  <button key={cat} onClick={() => { setCategory(cat); setShowCatPicker(false) }}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all"
                    style={{
                      borderColor: selected ? c : 'rgba(255,255,255,0.06)',
                      backgroundColor: selected ? `${c}15` : 'rgba(255,255,255,0.02)',
                    }}>
                    <span className="text-xl">{CATEGORY_EMOJIS[cat]}</span>
                    <span className="text-[10px] font-semibold text-text-2 text-center leading-tight">{cat}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
