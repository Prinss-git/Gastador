import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useExpenses } from '../hooks/useExpenses'
import { categorizeExpense } from '../services/ai'
import { CategoryBadge } from '../components/CategoryBadge'
import { CATEGORIES, type Category } from '../constants/categories'

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
      } finally {
        setCategoryLoading(false)
      }
    }, 600)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [description, amount])

  const handleSave = async () => {
    if (!description.trim()) return toast.error('Add a description')
    if (!amount || parseFloat(amount) <= 0) return toast.error('Enter a valid amount')
    if (!category) return toast.error('Category is required')
    setSaving(true)
    try {
      await saveExpense({
        description: description.trim(),
        amount: parseFloat(parseFloat(amount).toFixed(2)),
        category,
        date: new Date(date + 'T12:00:00'),
        notes: notes.trim() || undefined,
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
    <div className="pb-32 animate-fade-in overflow-x-hidden">
      {/* Header */}
      <div className="relative overflow-hidden px-4 pt-12 pb-6"
        style={{ background: 'linear-gradient(180deg, rgba(108,99,255,0.1) 0%, transparent 100%)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-card border border-border/50 flex items-center justify-center text-text-muted hover:text-text-primary transition-all">
            ←
          </button>
          <h1 className="text-xl font-bold text-text-primary">Add Expense</h1>
        </div>
      </div>

      <div className="px-4 space-y-3">
        {/* Description */}
        <div className="bg-card rounded-2xl p-4 border border-border/50">
          <label className="block text-text-muted text-xs font-bold mb-2 uppercase tracking-widest">Description</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Jollibee lunch, Grab to work…"
            className="w-full bg-transparent text-text-primary text-base outline-none placeholder:text-text-muted"
            autoFocus />
        </div>

        {/* Amount */}
        <div className="bg-card rounded-2xl p-4 border border-border/50">
          <label className="block text-text-muted text-xs font-bold mb-2 uppercase tracking-widest">Amount</label>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold gradient-text">₱</span>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00" min="0" step="0.01"
              className="flex-1 bg-transparent text-text-primary text-3xl font-bold outline-none placeholder:text-text-muted/30" />
          </div>
        </div>

        {/* Category */}
        <div className="bg-card rounded-2xl p-4 border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <label className="text-text-muted text-xs font-bold uppercase tracking-widest">Category</label>
            {category && !showPicker && (
              <button onClick={() => setShowPicker(true)}
                className="text-primary text-xs font-semibold px-2 py-1 rounded-lg bg-primary/10">
                Change
              </button>
            )}
          </div>

          {categoryLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-text-muted text-sm">AI categorizing…</span>
            </div>
          ) : !category || showPicker ? (
            <div>
              {!category && !showPicker && (
                <button onClick={() => setShowPicker(true)} className="text-primary text-sm font-semibold">
                  + Select category
                </button>
              )}
              {showPicker && (
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button key={cat} onClick={() => { setCategory(cat); setShowPicker(false) }}
                      className={`rounded-xl py-2 px-2 text-xs font-medium transition-all ${
                        category === cat ? 'ring-2 ring-primary scale-95' : 'hover:scale-95'
                      }`}
                      style={{ backgroundColor: category === cat ? 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.03)' }}>
                      <CategoryBadge category={cat} size="sm" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => setShowPicker(true)} className="animate-scale-in">
              <CategoryBadge category={category} />
            </button>
          )}
        </div>

        {/* Date */}
        <div className="bg-card rounded-2xl p-4 border border-border/50">
          <label className="block text-text-muted text-xs font-bold mb-2 uppercase tracking-widest">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            max={new Date().toISOString().slice(0, 10)}
            className="w-full bg-transparent text-text-primary outline-none text-sm" />
        </div>

        {/* Notes */}
        <div className="bg-card rounded-2xl p-4 border border-border/50">
          <label className="block text-text-muted text-xs font-bold mb-2 uppercase tracking-widest">Notes (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="Any details…" rows={2}
            className="w-full bg-transparent text-text-primary text-sm outline-none resize-none placeholder:text-text-muted" />
        </div>

        {/* Save button */}
        <button onClick={handleSave} disabled={saving}
          className={`w-full py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-95 ${
            saved ? 'bg-success' : saving ? 'opacity-60' : 'shadow-glow'
          }`}
          style={!saved ? { background: 'linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%)' } : {}}>
          {saved ? '✓ Saved!' : saving ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving…
            </span>
          ) : 'Save Expense'}
        </button>
      </div>
    </div>
  )
}
