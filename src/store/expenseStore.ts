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

export interface IncomeEntry {
  id: string
  description: string
  amount: number
  date: Date
  notes: string
}

export interface Budget {
  limit: number
  spent: number
}

interface ExpenseState {
  expenses: Expense[]
  income: IncomeEntry[]
  budget: Budget
  selectedMonth: string
  setExpenses: (expenses: Expense[]) => void
  addExpense: (expense: Expense) => void
  removeExpense: (id: string) => void
  setIncome: (income: IncomeEntry[]) => void
  addIncomeEntry: (entry: IncomeEntry) => void
  removeIncomeEntry: (id: string) => void
  setBudget: (budget: Budget) => void
  setSelectedMonth: (month: string) => void
}

const currentMonth = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: [],
  income: [],
  budget: { limit: 0, spent: 0 },
  selectedMonth: currentMonth(),
  setExpenses: (expenses) => set({ expenses }),
  addExpense: (expense) => set((s) => ({ expenses: [expense, ...s.expenses] })),
  removeExpense: (id) => set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),
  setIncome: (income) => set({ income }),
  addIncomeEntry: (entry) => set((s) => ({ income: [entry, ...s.income] })),
  removeIncomeEntry: (id) => set((s) => ({ income: s.income.filter((e) => e.id !== id) })),
  setBudget: (budget) => set({ budget }),
  setSelectedMonth: (month) => set({ selectedMonth: month }),
}))
