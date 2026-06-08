import { CATEGORY_COLORS, CATEGORY_EMOJIS, type Category } from '../constants/categories'

interface Props {
  category: Category
  size?: 'sm' | 'md'
}

export function CategoryBadge({ category, size = 'md' }: Props) {
  const color = CATEGORY_COLORS[category]
  const emoji = CATEGORY_EMOJIS[category]
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
      style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}30` }}
    >
      <span>{emoji}</span>
      {category}
    </span>
  )
}
