export function LoadingSkeleton({ className = 'h-12 w-full' }: { className?: string }) {
  return (
    <div
      className={`bg-emerald-100/60 animate-pulse rounded-lg ${className}`}
      aria-label="Loading..."
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white border border-border-warm rounded-card p-5 space-y-4 animate-pulse">
      <div className="h-24 bg-emerald-800/10 rounded-lg w-full" />
      <div className="h-5 bg-emerald-800/10 rounded w-3/4" />
      <div className="h-4 bg-emerald-800/10 rounded w-1/2" />
    </div>
  );
}
