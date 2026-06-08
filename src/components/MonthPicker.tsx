import { useExpenseStore } from '../store/expenseStore'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function MonthPicker() {
  const { selectedMonth, setSelectedMonth } = useExpenseStore()
  const [year, month] = selectedMonth.split('-').map(Number)

  const prev = () => {
    const d = new Date(year, month - 2, 1)
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  const next = () => {
    const d = new Date(year, month, 1)
    const now = new Date()
    if (d > now) return
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  const isCurrentMonth =
    new Date(year, month - 1, 1).getMonth() === new Date().getMonth() &&
    year === new Date().getFullYear()

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={prev}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-card text-white hover:bg-primary/20 transition-colors"
      >
        ‹
      </button>
      <span className="text-white font-medium text-sm min-w-[110px] text-center">
        {MONTHS[month - 1]} {year}
      </span>
      <button
        onClick={next}
        disabled={isCurrentMonth}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-card text-white hover:bg-primary/20 transition-colors disabled:opacity-30"
      >
        ›
      </button>
    </div>
  )
}
