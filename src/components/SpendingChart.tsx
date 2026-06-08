import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { CATEGORY_COLORS, type Category } from '../constants/categories'
import type { Expense } from '../store/expenseStore'

interface DonutChartProps {
  expenses: Expense[]
}

export function DonutChart({ expenses }: DonutChartProps) {
  const data: { name: Category; value: number }[] = []
  const totals: Record<string, number> = {}

  for (const e of expenses) {
    totals[e.category] = (totals[e.category] ?? 0) + e.amount
  }
  for (const [name, value] of Object.entries(totals)) {
    data.push({ name: name as Category, value })
  }

  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-text-muted text-sm">
        No expenses yet
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v: number) => `₱${v.toFixed(2)}`}
          contentStyle={{ background: '#1A1A2E', border: 'none', borderRadius: 8 }}
          labelStyle={{ color: '#fff' }}
          itemStyle={{ color: '#9CA3AF' }}
        />
        <Legend
          formatter={(value) => (
            <span style={{ color: '#9CA3AF', fontSize: 12 }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

interface BarChartProps {
  expenses: Expense[]
  month: string
}

export function DailyBarChart({ expenses, month }: BarChartProps) {
  const [year, mon] = month.split('-').map(Number)
  const daysInMonth = new Date(year, mon, 0).getDate()

  const dailyTotals: Record<number, number> = {}
  for (const e of expenses) {
    const day = e.date.getDate()
    dailyTotals[day] = (dailyTotals[day] ?? 0) + e.amount
  }

  const data = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    amount: dailyTotals[i + 1] ?? 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="day"
          tick={{ fill: '#9CA3AF', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          interval={4}
        />
        <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} tickLine={false} axisLine={false} />
        <Tooltip
          formatter={(v: number) => `₱${v.toFixed(2)}`}
          contentStyle={{ background: '#1A1A2E', border: 'none', borderRadius: 8 }}
          labelStyle={{ color: '#fff' }}
          cursor={{ fill: '#ffffff10' }}
        />
        <Bar dataKey="amount" fill="#6C63FF" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
