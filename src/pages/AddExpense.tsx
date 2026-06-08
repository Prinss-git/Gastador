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
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)
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
      setTimeout(() => navigate('/'), 800)
    } catch {
      setSaving(false)
    }
  }

  return (
    <div className="pb-24 px-4 pt-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-text-muted hover:text-white transition-colors">
          ←
        </button>
        <h1 className="text-xl font-bold text-white">Add Expense</h1>
      </div>

      <div className="space-y-4">
        {/* Description */}
        <div className="bg-card rounded-2xl p-4">
          <label className="block text-text-muted text-xs font-medium mb-2">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Jollibee lunch, Grab to work"
            className="w-full bg-transparent text-white text-base outline-none placeholder:text-text-muted"
            autoFocus
          />
        </div>

        {/* Amount */}
        <div className="bg-card rounded-2xl p-4">
          <label className="block text-text-muted text-xs font-medium mb-2">Amount</label>
          <div className="flex items-center gap-2">
            <span className="text-primary text-xl font-bold">₱</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="flex-1 bg-transparent text-white text-2xl font-bold outline-none placeholder:text-white/20"
            />
          </div>
        </div>

        {/* Category */}
        <div className="bg-card rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-text-muted text-xs font-medium">Category</label>
            {category && (
              <button
                onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                className="text-primary text-xs"
              >
                Change
              </button>
            )}
          </div>

          {categoryLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-text-muted text-sm">Categorizing…</span>
            </div>
          ) : category ? (
            <div>
              <button onClick={() => setShowCategoryPicker(!showCategoryPicker)}>
                <CategoryBadge category={category} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowCategoryPicker(true)}
              className="text-primary text-sm"
            >
              Select category
            </button>
          )}

          {showCategoryPicker && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setShowCategoryPicker(false) }}
                  className={`rounded-xl py-2 px-3 text-xs font-medium transition-all ${
                    category === cat ? 'ring-2 ring-primary' : ''
                  }`}
                  style={{
                    backgroundColor: category === cat ? '#6C63FF22' : '#0F0F1A',
                  }}
                >
                  <CategoryBadge category={cat} size="sm" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date */}
        <div className="bg-card rounded-2xl p-4">
          <label className="block text-text-muted text-xs font-medium mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={new Date().toISOString().slice(0, 10)}
            className="w-full bg-transparent text-white outline-none"
          />
        </div>

        {/* Notes */}
        <div className="bg-card rounded-2xl p-4">
          <label className="block text-text-muted text-xs font-medium mb-2">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional details…"
            rows={2}
            className="w-full bg-transparent text-white text-sm outline-none resize-none placeholder:text-text-muted"
          />
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full py-4 rounded-2xl font-bold text-white text-base transition-all ${
            saved
              ? 'bg-green-500'
              : saving
              ? 'bg-primary/60'
              : 'bg-primary hover:bg-primary-dark active:scale-95'
          }`}
        >
          {saved ? '✓ Saved!' : saving ? 'Saving…' : 'Save Expense'}
        </button>
      </div>
    </div>
  )
}
