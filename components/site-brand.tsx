import Link from "next/link"

export function SiteBrand() {
  return (
    <Link
      href="/"
      className="inline-flex w-fit items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-ring"
    >
      <span
        aria-hidden="true"
        className="relative size-10 shrink-0 rounded-xl bg-indigo-700"
      >
        <span className="absolute top-3.5 left-2 h-3.5 w-2.5 skew-y-14 rounded-xs bg-white" />
        <span className="absolute top-3.5 right-2 h-3.5 w-2.5 -skew-y-14 rounded-xs bg-white" />
        <span className="absolute top-1.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-amber-300" />
      </span>
      <span className="text-2xl font-bold tracking-tight">Tutor Lagbe</span>
    </Link>
  )
}
