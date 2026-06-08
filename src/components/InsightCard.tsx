import type { Insight } from '../services/ai'

interface Props {
  insight: Insight
}

export function InsightCard({ insight }: Props) {
  return (
    <div className="bg-card rounded-xl p-4 border border-primary/20 animate-slide-up">
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{insight.emoji}</span>
        <div>
          <p className="text-white font-semibold text-sm mb-1">{insight.title}</p>
          <p className="text-text-muted text-sm leading-relaxed">{insight.body}</p>
        </div>
      </div>
    </div>
  )
}
