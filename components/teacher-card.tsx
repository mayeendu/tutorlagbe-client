"use client"

import { ArrowUpRight, Pencil } from "lucide-react"
import Link from "next/link"

import { DashboardAvatar } from "@/components/dashboard-shell"
import { useSession } from "@/lib/auth-client"
import type { Teacher } from "@/lib/teacher-api"

export function TeacherEditLink({ teacher, className = "" }: { teacher: Teacher; className?: string }) {
  const { data } = useSession()
  const user = data?.user
  const id = encodeURIComponent(teacher.id)
  const editHref = user?.role === "admin"
    ? `/dashboard/admin/users/${id}?edit=1`
    : user?.role === "tutor" && user.id === teacher.id
      ? "/dashboard/profile?edit=1"
      : undefined
  if (!editHref) return null

  return (
    <Link href={editHref} className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border bg-background px-3 text-sm font-semibold hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring ${className}`}>
      <Pencil aria-hidden="true" className="size-4" />
      Edit profile<span className="sr-only"> for {teacher.name}</span>
    </Link>
  )
}

export function TeacherCard({ teacher }: { teacher: Teacher }) {
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-sm transition hover:border-indigo-500/50 hover:shadow-md">
      <div className="bg-linear-to-br from-indigo-100 via-indigo-50 to-background px-5 pt-6 pb-4 dark:from-indigo-950 dark:via-indigo-950/40">
        <DashboardAvatar user={teacher} />
        <h2 className="mt-4 text-xl font-bold tracking-tight wrap-anywhere">{teacher.name}</h2>
      </div>
      {teacher.bio && (
        <p className="mx-5 my-4 line-clamp-3 text-sm leading-relaxed whitespace-pre-line wrap-anywhere text-muted-foreground">{teacher.bio}</p>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-3 border-t px-5 py-4 text-sm font-semibold">
        <Link href={`/teachers/${encodeURIComponent(teacher.id)}`} className="inline-flex items-center gap-1 rounded-sm text-indigo-700 after:absolute after:inset-0 hover:underline focus-visible:outline-2 focus-visible:outline-ring dark:text-indigo-300">
          View profile<span className="sr-only"> for {teacher.name}</span>
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
        <TeacherEditLink teacher={teacher} className="relative ms-auto" />
      </div>
    </article>
  )
}
