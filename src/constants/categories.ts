export type Category =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Bills'
  | 'Health'
  | 'Entertainment'
  | 'Others'

export const CATEGORIES: Category[] = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Health',
  'Entertainment',
  'Others',
]

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: '#FF6B6B',
  Transport: '#4ECDC4',
  Shopping: '#FFE66D',
  Bills: '#A8E6CF',
  Health: '#FF8B94',
  Entertainment: '#B39DDB',
  Others: '#90A4AE',
}

export const CATEGORY_EMOJIS: Record<Category, string> = {
  Food: '🍔',
  Transport: '🚌',
  Shopping: '🛍️',
  Bills: '💡',
  Health: '💊',
  Entertainment: '🎮',
  Others: '📦',
}
