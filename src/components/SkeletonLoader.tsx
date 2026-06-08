export function SkeletonLoader({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="bg-card rounded-2xl p-4 border border-border/40">
          <div className="h-4 shimmer-bg rounded-lg w-3/4 mb-3" />
          <div className="h-3 shimmer-bg rounded-lg w-1/2" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-card rounded-2xl p-4 border border-border/40 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 shimmer-bg rounded-xl flex-shrink-0" />
        <div className="flex-1">
          <div className="h-4 shimmer-bg rounded-lg w-2/3 mb-2" />
          <div className="h-3 shimmer-bg rounded-lg w-full mb-1.5" />
          <div className="h-3 shimmer-bg rounded-lg w-3/4" />
        </div>
      </div>
    </div>
  )
}
