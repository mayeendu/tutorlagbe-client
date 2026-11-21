import type { Metadata } from "next"
import Link from "next/link"

import { TeacherCard } from "@/components/teacher-card"
import { readTeacherDirectory, type TeacherPage } from "@/lib/teacher-api"

export const metadata: Metadata = { title: "Our teachers | Tutor Lagbe" }

export default async function TeachersPage({ searchParams }: PageProps<"/teachers">) {
  const { page: value } = await searchParams
  const requested = typeof value === "string" ? Number(value) : 1
  const page = Number.isInteger(requested) && requested >= 1 && requested <= 1000 ? requested : 1
  const response = await readTeacherDirectory("?page=" + page)
  const teachers: TeacherPage | null = response?.ok ? await response.json().catch(() => null) : null

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <h1 className="text-4xl font-bold tracking-tight">Our teachers</h1>
      {!teachers ? (
        <p role="status" className="mt-6 rounded-xl border bg-card p-5">The teacher directory is temporarily unavailable. Refresh to try again.</p>
      ) : (
        <>
          {teachers.items.length ? (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {teachers.items.map((teacher) => (
                <li key={teacher.id}>
                  <TeacherCard teacher={teacher} />
                </li>
              ))}
            </ul>
          ) : <p className="mt-6 text-muted-foreground">No teachers found on this page.</p>}
          {(page > 1 || teachers.hasMore) && (
            <nav aria-label="Teacher directory pages" className="mt-8 flex flex-wrap items-center gap-4 text-sm">
              {page > 1 && <Link href={"/teachers?page=" + (page - 1)} className="rounded-lg border px-4 py-2 hover:bg-muted">Previous</Link>}
              <span>Page {page}</span>
              {teachers.hasMore && <Link href={"/teachers?page=" + (page + 1)} className="rounded-lg border px-4 py-2 hover:bg-muted">Next</Link>}
            </nav>
          )}
        </>
      )}
    </main>
  )
}
