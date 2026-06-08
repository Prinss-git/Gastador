import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend,
} from 'recharts'
import { CATEGORY_COLORS, type Category } from '../constants/categories'
import type { Expense } from '../store/expenseStore'

export function DonutChart({ expenses }: { expenses: Expense[] }) {
  const totals: Record<string, number> = {}
  for (const e of expenses) totals[e.category] = (totals[e.category] ?? 0) + e.amount
  const data = Object.entries(totals).map(([name, value]) => ({ name: name as Category, value }))

  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-text-3 text-sm">No expenses yet</div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
          {data.map((entry) => (
            <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v: number) => `₱${v.toFixed(2)}`}
          contentStyle={{ background: '#18181F', border: '1px solid #2E2E3E', borderRadius: 12 }}
          labelStyle={{ color: '#F2F2F8' }}
          itemStyle={{ color: '#A8A8C0' }}
        />
        <Legend formatter={(value) => <span style={{ color: '#A8A8C0', fontSize: 11 }}>{value}</span>} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function DailyBarChart({ expenses, month }: { expenses: Expense[]; month: string }) {
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
        <XAxis dataKey="day" tick={{ fill: '#62627A', fontSize: 10 }} tickLine={false} axisLine={false} interval={4} />
        <YAxis tick={{ fill: '#62627A', fontSize: 10 }} tickLine={false} axisLine={false} />
        <Tooltip
          formatter={(v: number) => `₱${v.toFixed(2)}`}
          contentStyle={{ background: '#18181F', border: '1px solid #2E2E3E', borderRadius: 12 }}
          labelStyle={{ color: '#F2F2F8' }}
          cursor={{ fill: 'rgba(124,111,255,0.08)' }}
        />
        <Bar dataKey="amount" fill="#7C6FFF" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
