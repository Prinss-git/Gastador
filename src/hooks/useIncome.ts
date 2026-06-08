import { useEffect, useCallback } from 'react'
import {
  collection, query, where, orderBy, onSnapshot,
  addDoc, deleteDoc, doc, Timestamp,
} from 'firebase/firestore'
import { toast } from 'react-hot-toast'
import { db } from '../services/firebase'
import { useExpenseStore, type IncomeEntry } from '../store/expenseStore'
import { useAuth } from './useAuth'

export function useIncome() {
  const { user } = useAuth()
  const { income, setIncome, addIncomeEntry, removeIncomeEntry, selectedMonth } = useExpenseStore()

  useEffect(() => {
    if (!user) return
    const [year, month] = selectedMonth.split('-').map(Number)
    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 1)

    const q = query(
      collection(db, 'users', user.uid, 'income'),
      where('date', '>=', Timestamp.fromDate(start)),
      where('date', '<', Timestamp.fromDate(end)),
      orderBy('date', 'desc')
    )

    const unsub = onSnapshot(q, (snap) => {
      const data: IncomeEntry[] = snap.docs.map((d) => ({
        id: d.id,
        description: d.data().description,
        amount: d.data().amount,
        date: d.data().date.toDate(),
        notes: d.data().notes ?? '',
      }))
      setIncome(data)
    }, () => toast.error('Failed to load income'))

    return unsub
  }, [user, selectedMonth, setIncome])

  const saveIncome = useCallback(async (data: Omit<IncomeEntry, 'id'>) => {
    if (!user) return
    try {
      const ref = await addDoc(collection(db, 'users', user.uid, 'income'), {
        description: data.description,
        amount: data.amount,
        date: Timestamp.fromDate(data.date),
        notes: data.notes ?? '',
      })
      addIncomeEntry({ ...data, id: ref.id })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      toast.error(`Save failed: ${msg}`)
      throw err
    }
  }, [user, addIncomeEntry])

  const deleteIncome = useCallback(async (id: string) => {
    if (!user) return
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'income', id))
      removeIncomeEntry(id)
      toast.success('Entry deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }, [user, removeIncomeEntry])

  return { income, saveIncome, deleteIncome }
}
