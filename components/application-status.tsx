import type { ApplicationStatus } from "@/lib/application-types"

const colors: Record<ApplicationStatus, string> = {
  pending: "bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-200",
  accepted: "bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-200",
  rejected: "bg-muted text-foreground",
}

export function ApplicationBadge({ status }: { status: ApplicationStatus }) {
  return <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${colors[status]}`}>{status}</span>
}
