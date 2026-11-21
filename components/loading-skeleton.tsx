type LoadingSkeletonProps = {
  label: string
  variant?: "cards" | "rows" | "detail"
  showHeading?: boolean
}

export function LoadingSkeleton({ label, variant = "rows", showHeading = false }: LoadingSkeletonProps) {
  const shape = "rounded-md bg-muted"

  return (
    <div role="status">
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className="space-y-5 motion-safe:animate-pulse">
        {showHeading && (
          <div className="space-y-3">
            <div className={`h-8 w-56 max-w-full ${shape}`} />
            <div className={`h-4 w-80 max-w-full ${shape}`} />
          </div>
        )}
        {variant === "detail" ? (
          <div className="space-y-4 rounded-2xl border bg-card p-5">
            <div className={`h-20 w-full ${shape}`} />
            <div className={`h-4 w-full ${shape}`} />
            <div className={`h-4 w-3/4 ${shape}`} />
          </div>
        ) : (
          <div className={variant === "cards" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "grid gap-3"}>
            {[0, 1, 2].map((item) => (
              <div key={item} className="space-y-3 rounded-2xl border bg-card p-5">
                {variant === "cards" && <div className={`mb-4 aspect-video ${shape}`} />}
                <div className={`h-5 w-2/3 ${shape}`} />
                <div className={`h-3.5 w-1/2 ${shape}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
