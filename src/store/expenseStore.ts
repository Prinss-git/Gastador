import { create } from 'zustand'
import type { Category } from '../constants/categories'

export interface Expense {
  id: string
  description: string
  amount: number
  category: Category
  date: Date
  notes?: string
  aiCategorized: boolean
}

export interface Budget {
  limit: number
  spent: number
}

interface ExpenseState {
  expenses: Expense[]
  budget: Budget
  selectedMonth: string // 'YYYY-MM'
  setExpenses: (expenses: Expense[]) => void
  addExpense: (expense: Expense) => void
  removeExpense: (id: string) => void
  setBudget: (budget: Budget) => void
  setSelectedMonth: (month: string) => void
}

const currentMonth = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: [],
  budget: { limit: 10000, spent: 0 },
  selectedMonth: currentMonth(),
  setExpenses: (expenses) => set({ expenses }),
  addExpense: (expense) =>
    set((state) => ({ expenses: [expense, ...state.expenses] })),
  removeExpense: (id) =>
    set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) })),
  setBudget: (budget) => set({ budget }),
  setSelectedMonth: (month) => set({ selectedMonth: month }),
}))
