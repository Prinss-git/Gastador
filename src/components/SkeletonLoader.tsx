export function SkeletonLoader({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="card p-4">
          <div className="h-4 skeleton w-3/4 mb-3" />
          <div className="h-3 skeleton w-1/2" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`card p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 skeleton flex-shrink-0" />
        <div className="flex-1">
          <div className="h-4 skeleton w-2/3 mb-2" />
          <div className="h-3 skeleton w-full mb-1.5" />
          <div className="h-3 skeleton w-3/4" />
        </div>
      </div>
    </div>
  )
}
