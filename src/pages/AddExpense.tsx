import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useExpenses } from '../hooks/useExpenses'
import { categorizeExpense } from '../services/ai'
import { CategoryBadge } from '../components/CategoryBadge'
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_EMOJIS, type Category } from '../constants/categories'

export default function AddExpense() {
  const navigate = useNavigate()
  const { saveExpense } = useExpenses()
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Category | null>(null)
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!description.trim() || !amount) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setCategoryLoading(true)
      try {
        const cat = await categorizeExpense(description, parseFloat(amount) || 0)
        setCategory(cat)
      } catch {
        setCategory('Others')
      } finally {
        setCategoryLoading(false)
      }
    }, 600)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [description, amount])

  const handleSave = async () => {
    if (!description.trim()) return toast.error('Add a description')
    if (!amount || parseFloat(amount) <= 0) return toast.error('Enter a valid amount')
    const finalCategory = category ?? 'Others'
    setSaving(true)
    try {
      await saveExpense({
        description: description.trim(),
        amount: parseFloat(parseFloat(amount).toFixed(2)),
        category: finalCategory,
        date: new Date(date + 'T12:00:00'),
        notes: notes.trim() || '',
        aiCategorized: true,
      })
      setSaved(true)
      toast.success('Expense saved!')
      setTimeout(() => navigate('/'), 700)
    } catch {
      setSaving(false)
    }
  }

  return (
    <div className="pb-32 min-h-screen bg-bg animate-fade-in overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-6">
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-bg-elevated border border-border flex items-center justify-center text-text-2 hover:text-text-1 transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h1 className="text-text-1 text-xl font-bold">Add Expense</h1>
      </div>

      <div className="px-5 space-y-3">
        {/* Amount — hero input */}
        <div className="card p-5">
          <p className="section-label mb-3">Amount</p>
          <div className="flex items-center gap-3">
            <span className="text-primary text-3xl font-bold">₱</span>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00" min="0" step="0.01" autoFocus
              className="flex-1 bg-transparent text-text-1 text-4xl font-bold outline-none placeholder:text-text-3/40 tracking-tight" />
          </div>
        </div>

        {/* Description */}
        <div className="card p-4">
          <p className="section-label mb-2">Description</p>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you spend on?"
            className="w-full bg-transparent text-text-1 text-base outline-none placeholder:text-text-3" />
        </div>

        {/* Category */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="section-label">Category</p>
            {category && !showPicker && (
              <button onClick={() => setShowPicker(true)} className="text-primary text-xs font-semibold">Change</button>
            )}
          </div>

          {categoryLoading ? (
            <div className="flex items-center gap-2 text-text-3 text-sm">
              <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
              AI categorizing…
            </div>
          ) : showPicker || !category ? (
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => {
                const color = CATEGORY_COLORS[cat]
                const emoji = CATEGORY_EMOJIS[cat]
                const selected = category === cat
                return (
                  <button key={cat} onClick={() => { setCategory(cat); setShowPicker(false) }}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-150 ${
                      selected ? 'border-primary' : 'border-border hover:border-border-light'
                    }`}
                    style={{ backgroundColor: selected ? `${color}18` : 'rgba(255,255,255,0.02)' }}>
                    <span className="text-xl">{emoji}</span>
                    <span className="text-[10px] font-semibold text-text-2 text-center leading-tight">{cat}</span>
                  </button>
                )
              })}
            </div>
          ) : (
            <button onClick={() => setShowPicker(true)} className="animate-scale-in">
              <CategoryBadge category={category} />
            </button>
          )}
        </div>

        {/* Date & Notes row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="card p-4">
            <p className="section-label mb-2">Date</p>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
              className="w-full bg-transparent text-text-1 text-sm outline-none" />
          </div>
          <div className="card p-4">
            <p className="section-label mb-2">Notes</p>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional…"
              className="w-full bg-transparent text-text-1 text-sm outline-none placeholder:text-text-3" />
          </div>
        </div>

        {/* Save */}
        <button onClick={handleSave} disabled={saving || saved}
          className={`w-full py-4 rounded-2xl font-bold text-white text-sm transition-all duration-200 active:scale-[0.98] ${
            saved ? 'bg-success' : 'bg-primary shadow-primary hover:bg-primary-soft disabled:opacity-50'
          }`}>
          {saved ? '✓ Saved!' : saving
            ? <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…
              </span>
            : 'Save Expense'}
        </button>
      </div>
    </div>
  )
}
