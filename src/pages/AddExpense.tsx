import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useExpenses } from '../hooks/useExpenses'
import { categorizeExpense } from '../services/ai'
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_EMOJIS, type Category } from '../constants/categories'

function formatDisplay(s: string): string {
  if (!s) return '0'
  const [intPart, decPart] = s.split('.')
  const formatted = parseInt(intPart || '0', 10).toLocaleString('en-PH')
  return decPart !== undefined ? `${formatted}.${decPart}` : formatted
}

const KEYS = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['.', '0', '⌫'],
]

export default function AddExpense() {
  const navigate = useNavigate()
  const { saveExpense } = useExpenses()

  const [amountStr, setAmountStr] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<Category | null>(null)
  const [showCatPicker, setShowCatPicker] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const descRef = useRef<HTMLInputElement>(null)

  // AI categorize when description changes
  useEffect(() => {
    if (!description.trim()) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setAiLoading(true)
      try {
        const cat = await categorizeExpense(description, parseFloat(amountStr) || 0)
        setCategory(cat)
      } catch {
        setCategory('Others')
      } finally {
        setAiLoading(false)
      }
    }, 700)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [description])

  function handleKey(key: string) {
    if (saved) return
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

  const amount = parseFloat(amountStr) || 0

  const handleSave = async () => {
    if (!description.trim()) {
      descRef.current?.focus()
      return toast.error('Add a description')
    }
    if (amount <= 0) return toast.error('Enter an amount')
    setSaving(true)
    try {
      await saveExpense({
        description: description.trim(),
        amount: parseFloat(amount.toFixed(2)),
        category: category ?? 'Others',
        date: new Date(date + 'T12:00:00'),
        notes: '',
        aiCategorized: true,
      })
      setSaved(true)
      toast.success('Expense saved')
      setTimeout(() => navigate('/'), 600)
    } catch {
      setSaving(false)
    }
  }

  const color = category ? CATEGORY_COLORS[category] : '#7C6FFF'

  return (
    <div className="flex flex-col min-h-screen bg-bg overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-4">
        <button onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-xl bg-bg-elevated border border-border flex items-center justify-center text-text-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h1 className="text-text-1 text-lg font-semibold">Add Expense</h1>
      </div>

      {/* Amount display */}
      <div className="px-6 pb-4">
        <p className="text-text-3 text-xs font-medium mb-1">Amount</p>
        <div className="flex items-baseline gap-2">
          <span className="text-primary text-2xl font-semibold">₱</span>
          <span className={`font-bold tracking-tight transition-colors ${amountStr ? 'text-text-1' : 'text-text-3'}`}
            style={{ fontSize: 'clamp(2.5rem, 12vw, 3.5rem)' }}>
            {formatDisplay(amountStr)}
          </span>
        </div>
      </div>

      {/* Description + Category + Date */}
      <div className="px-5 space-y-2 mb-4">
        {/* Description */}
        <div className="bg-bg-elevated rounded-2xl border border-border px-4 py-3">
          <p className="text-text-3 text-[10px] font-semibold uppercase tracking-widest mb-1.5">Description</p>
          <input
            ref={descRef}
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you spend on?"
            className="w-full bg-transparent text-text-1 text-sm outline-none placeholder:text-text-3"
          />
        </div>

        {/* Category + Date row */}
        <div className="grid grid-cols-2 gap-2">
          {/* Category */}
          <button onClick={() => setShowCatPicker(true)}
            className="bg-bg-elevated rounded-2xl border border-border px-4 py-3 text-left">
            <p className="text-text-3 text-[10px] font-semibold uppercase tracking-widest mb-1.5">Category</p>
            {aiLoading ? (
              <div className="flex items-center gap-1.5 text-text-3 text-xs">
                <span className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
                Detecting…
              </div>
            ) : category ? (
              <div className="flex items-center gap-1.5">
                <span className="text-base">{CATEGORY_EMOJIS[category]}</span>
                <span className="text-text-1 text-sm font-medium">{category}</span>
              </div>
            ) : (
              <span className="text-text-3 text-sm">Select…</span>
            )}
          </button>

          {/* Date */}
          <div className="bg-bg-elevated rounded-2xl border border-border px-4 py-3">
            <p className="text-text-3 text-[10px] font-semibold uppercase tracking-widest mb-1.5">Date</p>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
              className="w-full bg-transparent text-text-1 text-sm outline-none" />
          </div>
        </div>
      </div>

      {/* Numpad */}
      <div className="flex-1 px-4 pb-2">
        <div className="grid grid-cols-3 gap-2 h-full max-h-72">
          {KEYS.flat().map((key) => (
            <button
              key={key}
              onPointerDown={() => handleKey(key)}
              className="flex items-center justify-center rounded-2xl bg-bg-elevated border border-border
                         text-text-1 font-medium text-xl
                         transition-all duration-75 active:scale-95 active:bg-surface select-none"
            >
              {key === '⌫' ? (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z" /><line x1="18" y1="9" x2="14" y2="13" /><line x1="14" y1="9" x2="18" y2="13" />
                </svg>
              ) : key}
            </button>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="px-5 pb-36 pt-2">
        <button onClick={handleSave} disabled={saving || saved}
          className={`w-full py-4 rounded-2xl font-semibold text-white text-sm transition-all duration-150 active:scale-[0.98] disabled:opacity-60 ${
            saved ? 'bg-success' : 'bg-primary shadow-primary'
          }`}>
          {saved ? '✓ Saved' : saving
            ? <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…
              </span>
            : 'Save Expense'}
        </button>
      </div>

      {/* Category picker modal */}
      {showCatPicker && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={() => setShowCatPicker(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-app mx-auto bg-bg-overlay rounded-t-3xl border-t border-border p-5 pb-safe"
            onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-border mx-auto mb-5" />
            <p className="text-text-1 font-semibold text-sm mb-4">Choose Category</p>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => {
                const c = CATEGORY_COLORS[cat]
                const selected = category === cat
                return (
                  <button key={cat}
                    onClick={() => { setCategory(cat); setShowCatPicker(false) }}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all duration-150"
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
        </div>
      )}
    </div>
  )
}
