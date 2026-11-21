import { ArrowLeft } from "lucide-react"

import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { DashboardAvatar } from "@/components/dashboard-shell"
import { TeacherEditLink } from "@/components/teacher-card"
import { readTeacherDirectory, type Teacher } from "@/lib/teacher-api"

export const metadata: Metadata = { title: "Teacher profile | Tutor Lagbe" }

export default async function TeacherProfilePage({ params }: PageProps<"/teachers/[id]">) {
  const { id } = await params
  if (!/^[\w-]{1,128}$/.test(id)) notFound()

  const response = await readTeacherDirectory("/" + encodeURIComponent(id))
  if (response?.status === 404) notFound()
  const teacher: Teacher | null = response?.ok ? await response.json().catch(() => null) : null

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-14">
      <Link href="/teachers" className="inline-flex min-h-10 items-center gap-2 rounded-lg border bg-card px-3 text-sm font-semibold hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring">
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to teachers
      </Link>
      {teacher ? (
        <article className="relative isolate mt-6 overflow-hidden rounded-3xl border bg-card shadow-sm">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-38 border-b border-indigo-500/10 bg-linear-to-br from-indigo-200 via-sky-100 to-violet-100 dark:from-indigo-950 dark:via-sky-950 dark:to-violet-950 sm:h-48" />
          <header className="px-6 pt-24 pb-7 sm:px-10 sm:pt-30">
            <div className="w-fit rounded-full bg-card p-1.5 shadow-sm [&>span]:size-24 [&>span]:text-3xl sm:[&>span]:size-32">
              <DashboardAvatar user={teacher} />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
              <h1 className="min-w-0 text-3xl font-bold tracking-tight wrap-anywhere sm:text-5xl">{teacher.name}</h1>
              <TeacherEditLink teacher={teacher} />
            </div>
          </header>
          <section aria-labelledby="teacher-about" className="border-t px-6 py-7 sm:px-10 sm:py-9">
            <h2 id="teacher-about" className="text-xl font-semibold tracking-tight">About</h2>
            <p className="mt-3 max-w-prose leading-relaxed whitespace-pre-wrap wrap-anywhere text-muted-foreground sm:text-lg">
              {teacher.bio || "This teacher has not added a bio yet."}
            </p>
          </section>
        </article>
      ) : (
        <h1 className="mt-6 text-2xl font-semibold">This teacher profile is temporarily unavailable.</h1>
      )}
    </main>
  )
}