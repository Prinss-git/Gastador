import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useExpenses } from '../hooks/useExpenses'
import { useInsights } from '../hooks/useInsights'
import { useExpenseStore } from '../store/expenseStore'
import { useAuth } from '../hooks/useAuth'
import { MonthPicker } from '../components/MonthPicker'
import { ExpenseCard } from '../components/ExpenseCard'
import { InsightCard } from '../components/InsightCard'
import { DonutChart, DailyBarChart } from '../components/SpendingChart'
import { SkeletonCard } from '../components/SkeletonLoader'

function BudgetBar({ spent, limit }: { spent: number; limit: number }) {
  const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
  const color = pct >= 90 ? '#EF4444' : pct >= 70 ? '#F59E0B' : '#10B981'

  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-text-muted">Spent</span>
        <span style={{ color }}>
          ₱{spent.toFixed(2)} / ₱{limit.toFixed(2)}
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { expenses, budget, deleteExpense } = useExpenses()
  const { selectedMonth } = useExpenseStore()
  const { insights, loading: insightsLoading, error: insightsError, loadInsights } = useInsights()
  const [budgetEditMode, setBudgetEditMode] = useState(false)
  const [budgetInput, setBudgetInput] = useState('')

  const total = expenses.reduce((s, e) => s + e.amount, 0)

  useEffect(() => {
    if (expenses.length > 0) {
      loadInsights(selectedMonth, expenses, total, budget.limit, 0)
    }
  }, [selectedMonth]) // eslint-disable-line react-hooks/exhaustive-deps

  const recent = expenses.slice(0, 3)

  return (
    <div className="pb-24 px-4 pt-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gastador 💸</h1>
          <p className="text-text-muted text-sm">{user?.email}</p>
        </div>
        <button
          onClick={signOut}
          className="text-text-muted text-xs px-3 py-1.5 rounded-lg bg-card hover:text-white transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* Month picker */}
      <div className="flex justify-center">
        <MonthPicker />
      </div>

      {/* Budget card */}
      <div className="bg-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-white font-semibold">Monthly Budget</p>
          <button
            onClick={() => { setBudgetEditMode(!budgetEditMode); setBudgetInput(String(budget.limit)) }}
            className="text-primary text-xs"
          >
            {budgetEditMode ? 'Cancel' : 'Edit'}
          </button>
        </div>
        {budgetEditMode ? (
          <div className="flex gap-2">
            <input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="flex-1 bg-background text-white rounded-xl px-3 py-2 text-sm outline-none border border-primary"
            />
            <button
              onClick={() => { setBudgetEditMode(false) }}
              className="bg-primary text-white rounded-xl px-4 py-2 text-sm font-medium"
            >
              Save
            </button>
          </div>
        ) : (
          <BudgetBar spent={total} limit={budget.limit} />
        )}
        <p className="text-3xl font-bold text-white">₱{total.toFixed(2)}</p>
      </div>

      {/* Donut chart */}
      <div className="bg-card rounded-2xl p-4">
        <p className="text-white font-semibold mb-3">By Category</p>
        <DonutChart expenses={expenses} />
      </div>

      {/* Daily bar chart */}
      <div className="bg-card rounded-2xl p-4">
        <p className="text-white font-semibold mb-3">Daily Spending</p>
        <DailyBarChart expenses={expenses} month={selectedMonth} />
      </div>

      {/* Recent expenses */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-white font-semibold">Recent</p>
          <Link to="/history" className="text-primary text-sm">See all</Link>
        </div>
        {recent.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-white font-medium">No expenses yet</p>
            <p className="text-text-muted text-sm mt-1">Tap + to add your first expense</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((e) => (
              <ExpenseCard key={e.id} expense={e} onDelete={deleteExpense} />
            ))}
          </div>
        )}
      </div>

      {/* AI Insights */}
      <div>
        <p className="text-white font-semibold mb-3">✨ AI Insights</p>
        {insightsLoading ? (
          <div className="space-y-2">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : insightsError ? (
          <div className="bg-card rounded-2xl p-4 text-center">
            <p className="text-text-muted text-sm">{insightsError}</p>
            <button
              onClick={() => loadInsights(selectedMonth, expenses, total, budget.limit, 0)}
              className="text-primary text-sm mt-2"
            >
              Retry
            </button>
          </div>
        ) : insights.length === 0 && expenses.length > 0 ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="space-y-2">
            {insights.slice(0, 3).map((ins, i) => (
              <InsightCard key={i} insight={ins} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
