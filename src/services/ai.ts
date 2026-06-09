import { keywordCategorize } from './categorizer'
import type { Category } from '../constants/categories'

const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY ?? ''
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

const VALID_CATEGORIES = new Set([
  'Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Others',
])

async function groq(prompt: string, maxTokens: number, temperature = 0): Promise<string> {
  if (!GROQ_KEY) throw new Error('Groq API key not configured')
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'You are a helpful assistant. Always respond in English only. Never use Filipino, Tagalog, or any other language.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: maxTokens,
      temperature,
    }),
  })
  if (!res.ok) throw new Error(`Groq error ${res.status}`)
  const data = await res.json()
  return data.choices[0].message.content.trim()
}

export async function categorizeExpense(description: string, amount: number): Promise<Category> {
  if (!GROQ_KEY) return keywordCategorize(description)
  try {
    const prompt =
      'Categorize this expense into exactly one of: Food, Transport, Shopping, Bills, Health, Entertainment, Others.\n' +
      'Consider Philippine merchants: Jollibee, Grab, SM, Mercury Drug, Globe, Meralco, Lazada, Shopee, etc.\n' +
      `Expense: "${description}" — ₱${amount}\n` +
      'Reply with ONLY the category name, nothing else.'
    const raw = await groq(prompt, 10)
    return (VALID_CATEGORIES.has(raw) ? raw : 'Others') as Category
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
  if (!GROQ_KEY) throw new Error('Groq API key not configured')

  const breakdown: Record<string, number> = {}
  for (const e of payload.expenses) {
    breakdown[e.category] = (breakdown[e.category] ?? 0) + e.amount
  }
  const breakdownStr = Object.entries(breakdown)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amt]) => `${cat}: ₱${amt.toFixed(2)}`)
    .join(', ')

  const top5 = [...payload.expenses].sort((a, b) => b.amount - a.amount).slice(0, 5)
  const top5Str = top5.map(e => `- ${e.description} (${e.category}): ₱${e.amount.toFixed(2)}`).join('\n')

  const prompt =
    `The user spent ₱${payload.total.toFixed(2)} in ${payload.month}.\n` +
    `Breakdown: ${breakdownStr}.\n` +
    `Top expenses:\n${top5Str}\n` +
    `Previous month total: ₱${payload.previousMonth.total.toFixed(2)}.\n\n` +
    'Give exactly 3 short, practical, friendly money-saving insights. Respond in English only. Max 2 sentences each.\n' +
    'Return ONLY a JSON array: [{"title": string, "body": string, "emoji": string}]'

  const raw = await groq(prompt, 512, 0.7)

  // Strip markdown code fences if present
  const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()

  try {
    const data = JSON.parse(cleaned)
    return data as Insight[]
  } catch {
    throw new Error('AI returned invalid response')
  }
}
