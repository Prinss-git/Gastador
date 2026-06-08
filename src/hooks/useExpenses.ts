import { useEffect, useCallback } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
  setDoc,
  getDoc,
} from 'firebase/firestore'
import { toast } from 'react-hot-toast'
import { db } from '../services/firebase'
import { useExpenseStore, type Expense } from '../store/expenseStore'
import { useAuth } from './useAuth'
import type { Category } from '../constants/categories'

export function useExpenses() {
  const { user } = useAuth()
  const { expenses, setExpenses, addExpense, removeExpense, budget, setBudget, selectedMonth } =
    useExpenseStore()

  // Subscribe to expenses for selected month
  useEffect(() => {
    if (!user) return

    const [year, month] = selectedMonth.split('-').map(Number)
    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 1)

    const q = query(
      collection(db, 'users', user.uid, 'expenses'),
      where('date', '>=', Timestamp.fromDate(start)),
      where('date', '<', Timestamp.fromDate(end)),
      orderBy('date', 'desc')
    )

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data: Expense[] = snap.docs.map((d) => ({
          id: d.id,
          description: d.data().description,
          amount: d.data().amount,
          category: d.data().category as Category,
          date: d.data().date.toDate(),
          notes: d.data().notes,
          aiCategorized: d.data().aiCategorized ?? false,
        }))
        setExpenses(data)
      },
      () => toast.error('Failed to load expenses')
    )

    return unsub
  }, [user, selectedMonth, setExpenses])

  // Subscribe to budget
  useEffect(() => {
    if (!user) return

    const budgetRef = doc(db, 'users', user.uid, 'budgets', selectedMonth)
    getDoc(budgetRef)
      .then((snap) => {
        if (snap.exists()) {
          setBudget({ limit: snap.data().limit, spent: snap.data().spent ?? 0 })
        } else {
          setBudget({ limit: 10000, spent: 0 })
        }
      })
      .catch(() => toast.error('Failed to load budget'))
  }, [user, selectedMonth, setBudget])

  const saveExpense = useCallback(
    async (data: Omit<Expense, 'id'>) => {
      if (!user) return
      try {
        const docRef = await addDoc(collection(db, 'users', user.uid, 'expenses'), {
          ...data,
          date: Timestamp.fromDate(data.date),
        })
        addExpense({ ...data, id: docRef.id })

        // Update budget spent
        const newSpent = (budget.spent ?? 0) + data.amount
        await setDoc(
          doc(db, 'users', user.uid, 'budgets', selectedMonth),
          { limit: budget.limit, spent: newSpent },
          { merge: true }
        )
        setBudget({ ...budget, spent: newSpent })
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error('saveExpense error:', msg)
        toast.error(`Save failed: ${msg}`)
        throw err
      }
    },
    [user, budget, selectedMonth, addExpense, setBudget]
  )

  const deleteExpense = useCallback(
    async (id: string) => {
      if (!user) return
      const expense = expenses.find((e) => e.id === id)
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'expenses', id))
        removeExpense(id)
        if (expense) {
          const newSpent = Math.max(0, (budget.spent ?? 0) - expense.amount)
          await setDoc(
            doc(db, 'users', user.uid, 'budgets', selectedMonth),
            { spent: newSpent },
            { merge: true }
          )
          setBudget({ ...budget, spent: newSpent })
        }
        toast.success('Expense deleted')
      } catch {
        toast.error('Failed to delete expense')
      }
    },
    [user, expenses, budget, selectedMonth, removeExpense, setBudget]
  )

  const updateBudgetLimit = useCallback(
    async (limit: number) => {
      if (!user) return
      try {
        await setDoc(
          doc(db, 'users', user.uid, 'budgets', selectedMonth),
          { limit },
          { merge: true }
        )
        setBudget({ ...budget, limit })
        toast.success('Budget updated')
      } catch {
        toast.error('Failed to update budget')
      }
    },
    [user, budget, selectedMonth, setBudget]
  )

  return { expenses, budget, saveExpense, deleteExpense, updateBudgetLimit }
}
