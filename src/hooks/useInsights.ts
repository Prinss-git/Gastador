import { useState, useCallback } from 'react'
import { fetchInsights, type Insight } from '../services/ai'
import type { Expense } from '../store/expenseStore'

export function useInsights() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadInsights = useCallback(
    async (
      month: string,
      expenses: Expense[],
      total: number,
      budget: number,
      previousMonthTotal: number
    ) => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchInsights({
          month,
          expenses: expenses.map((e) => ({
            description: e.description,
            amount: e.amount,
            category: e.category,
          })),
          total,
          budget,
          previousMonth: { total: previousMonthTotal },
        })
        setInsights(data)
      } catch {
        setError('Could not load insights. Check your connection.')
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { insights, loading, error, loadInsights }
}
