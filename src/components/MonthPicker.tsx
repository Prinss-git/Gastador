import { useExpenseStore } from '../store/expenseStore'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export function MonthPicker() {
  const { selectedMonth, setSelectedMonth } = useExpenseStore()
  const [year, month] = selectedMonth.split('-').map(Number)

  const prev = () => {
    const d = new Date(year, month - 2, 1)
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  const next = () => {
    const d = new Date(year, month, 1)
    if (d > new Date()) return
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  const isCurrentMonth = year === new Date().getFullYear() && month === new Date().getMonth() + 1

  return (
    <div className="flex items-center gap-1.5">
      <button onClick={prev}
        className="w-7 h-7 flex items-center justify-center rounded-lg bg-surface text-text-2 hover:text-text-1 hover:bg-surface-hover transition-colors text-lg leading-none">
        ‹
      </button>
      <span className="text-text-2 font-semibold text-xs min-w-[72px] text-center">
        {MONTHS[month - 1]} {year}
      </span>
      <button onClick={next} disabled={isCurrentMonth}
        className="w-7 h-7 flex items-center justify-center rounded-lg bg-surface text-text-2 hover:text-text-1 hover:bg-surface-hover transition-colors text-lg leading-none disabled:opacity-30">
        ›
      </button>
    </div>
  )
}
