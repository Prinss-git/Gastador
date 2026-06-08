import { keywordCategorize } from './categorizer'
import type { Category } from '../constants/categories'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

const backendAvailable = API_BASE.length > 0 && !API_BASE.includes('localhost')

export async function categorizeExpense(
  description: string,
  amount: number
): Promise<Category> {
  if (!backendAvailable) return keywordCategorize(description)
  try {
    const res = await fetch(`${API_BASE}/categorize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, amount }),
    })
    if (!res.ok) throw new Error('API error')
    const data = await res.json()
    return data.category as Category
  } catch {
    return keywordCategorize(description)
  }
}

export interface Insight {
  title: string
  body: string
  emoji: string
}

export interface InsightsPayload {
  month: string
  expenses: Array<{ description: string; amount: number; category: string }>
  total: number
  budget: number
  previousMonth: { total: number }
}

export async function fetchInsights(payload: InsightsPayload): Promise<Insight[]> {
  if (!backendAvailable) throw new Error('Backend not configured')
  const res = await fetch(`${API_BASE}/insights`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to fetch insights')
  return res.json()
}
