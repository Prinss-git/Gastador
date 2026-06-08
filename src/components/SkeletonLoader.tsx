interface Props {
  lines?: number
  className?: string
}

export function SkeletonLoader({ lines = 3, className = '' }: Props) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="bg-card rounded-xl p-4 animate-pulse">
          <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
          <div className="h-3 bg-white/10 rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-card rounded-xl p-4 animate-pulse ${className}`}>
      <div className="h-5 bg-white/10 rounded w-1/2 mb-3" />
      <div className="h-3 bg-white/10 rounded w-full mb-2" />
      <div className="h-3 bg-white/10 rounded w-3/4" />
    </div>
  )
}
