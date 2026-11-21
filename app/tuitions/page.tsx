import Link from "next/link"
import { redirect } from "next/navigation"

import { TuitionCard } from "@/components/tuition-card"
import { TuitionFilterForm } from "@/components/tuition-filter-form"
import { ToastFeedback } from "@/components/toast-feedback"
import { readTuitions } from "@/lib/tuition-api"
import type { TuitionPage } from "@/lib/tuition-types"

const fields = [
  { key: "q", label: "Search", placeholder: "Title or subject", max: 100 },
  { key: "subject", label: "Subject", placeholder: "Any subject", max: 60 },
  { key: "classLevel", label: "Class level", placeholder: "Any class", max: 40 },
] as const
const control = "h-11 w-full rounded-lg border bg-background px-3 text-base focus-visible:outline-2 focus-visible:outline-ring"
const pageLink = "inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border px-3 focus-visible:outline-2 focus-visible:outline-ring"

export default async function TuitionsPage({ searchParams }: PageProps<"/tuitions">) {
  const params = await searchParams
  const filters = new URLSearchParams()
  for (const { key, max } of fields) {
    const value = params[key]
    if (typeof value === "string" && value.trim()) filters.set(key, value.trim().slice(0, max))
  }
  if (params.mode === "Online" || params.mode === "Offline") filters.set("mode", params.mode)
  const pageValue = typeof params.page === "string" ? Number(params.page) : 1
  const page = Number.isInteger(pageValue) && pageValue >= 1 && pageValue <= 1000 ? pageValue : 1
  const linkTo = (number: number) => {
    const next = new URLSearchParams(filters)
    if (number > 1) next.set("page", String(number))
    const query = next.toString()
    return query ? `/tuitions?${query}` : "/tuitions"
  }

  const request = new URLSearchParams(filters)
  request.set("page", String(page))
  const response = await readTuitions(`?${request}`)
  const results: TuitionPage | null = response?.ok ? await response.json().catch(() => null) : null
  const totalPages = results?.totalPages ?? page + Number(results?.hasMore === true)
  if (page > totalPages) redirect(linkTo(totalPages))
  const pageNumbers = [...new Set([1, page - 1, page, page + 1, totalPages])]
    .filter((number) => number >= 1 && number <= totalPages)
    .sort((a, b) => a - b)

  return (
    <main className="mx-auto max-w-360 px-5 py-12 sm:px-8 lg:px-12">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Browse tuitions</h1>
      <p className="mt-3 text-muted-foreground">Find online or in-person lessons by subject and class level.</p>
      <TuitionFilterForm action="/tuitions" aria-label="Filter tuitions" className="my-7 grid gap-4 rounded-2xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
        {fields.map(({ key, label, placeholder, max }) => (
          <label key={key} className="grid gap-1.5 text-sm font-medium">
            {label}
            <input name={key} defaultValue={filters.get(key) ?? ""} placeholder={placeholder} maxLength={max} className={control} />
          </label>
        ))}
        <label className="grid gap-1.5 text-sm font-medium">
          Mode
          <select name="mode" defaultValue={filters.get("mode") ?? ""} className={control}>
            <option value="">Any mode</option><option>Online</option><option>Offline</option>
          </select>
        </label>
        <div className="flex items-center gap-3">
          <button type="submit" className="h-11 rounded-lg bg-indigo-700 px-4 font-semibold text-white hover:bg-indigo-800">Apply filters</button>
          {filters.size > 0 && <Link href="/tuitions" className="text-sm font-medium underline">Clear</Link>}
        </div>
      </TuitionFilterForm>
      {!results && <ToastFeedback message="Tuition listings are temporarily unavailable." />}

      {!results ? (
        <p className="rounded-2xl border bg-card p-6 text-muted-foreground">
          Tuition listings are temporarily unavailable. You can still <Link href="/courses" className="font-medium underline">browse the course catalog</Link>.
        </p>
      ) : results.items.length ? (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.items.map((tuition) => <TuitionCard key={tuition.id} tuition={tuition} />)}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed p-6 text-muted-foreground">No tuitions match your filters.</p>
      )}
      {results && totalPages > 1 && (
        <nav aria-label="Tuition pages" className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm font-medium">
          {page > 1 && <Link href={linkTo(page - 1)} rel="prev" className={`${pageLink} hover:bg-muted`}>Previous</Link>}
          <ul className="flex flex-wrap items-center gap-2">
            {pageNumbers.map((number, index) => (
              <li key={number} className="flex items-center gap-2">
                {index > 0 && number - pageNumbers[index - 1] > 1 && <span aria-hidden="true">…</span>}
                <Link
                  href={linkTo(number)}
                  aria-label={`Page ${number}`}
                  aria-current={number === page ? "page" : undefined}
                  className={`${pageLink} ${number === page ? "border-indigo-700 bg-indigo-700 text-white" : "hover:bg-muted"}`}
                >
                  {number}
                </Link>
              </li>
            ))}
          </ul>
          {page < totalPages && <Link href={linkTo(page + 1)} rel="next" className={`${pageLink} hover:bg-muted`}>Next</Link>}
        </nav>
      )}
    </main>
  )
}
