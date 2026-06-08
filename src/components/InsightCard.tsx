import type { Insight } from '../services/ai'

export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <div className="bg-bg-elevated rounded-2xl border border-border p-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-surface flex items-center justify-center text-lg flex-shrink-0">
          {insight.emoji}
        </div>
        <div className="min-w-0">
          <p className="text-text-1 font-semibold text-sm mb-1">{insight.title}</p>
          <p className="text-text-2 text-xs leading-relaxed">{insight.body}</p>
        </div>
      </div>
    </div>
  )
}
