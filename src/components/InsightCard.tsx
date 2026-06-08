import type { Insight } from '../services/ai'

export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <div className="card p-4 border-primary/20 hover:border-primary/40 transition-colors duration-200">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-primary-bg">
          {insight.emoji}
        </div>
        <div>
          <p className="text-text-1 font-bold text-sm mb-1">{insight.title}</p>
          <p className="text-text-2 text-sm leading-relaxed">{insight.body}</p>
        </div>
      </div>
    </div>
  )
}
