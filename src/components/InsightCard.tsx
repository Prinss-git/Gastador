import type { Insight } from '../services/ai'

export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <div className="bg-card rounded-2xl p-4 border border-primary/20 animate-slide-up hover:border-primary/40 transition-all duration-300 hover:shadow-glow-sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.2) 0%, rgba(255,107,157,0.2) 100%)' }}>
          {insight.emoji}
        </div>
        <div>
          <p className="text-text-primary font-bold text-sm mb-1">{insight.title}</p>
          <p className="text-text-secondary text-sm leading-relaxed">{insight.body}</p>
        </div>
      </div>
    </div>
  )
}
