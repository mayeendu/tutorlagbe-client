"use client"

import Link from "next/link"
import { useState } from "react"

import { LoadingSkeleton } from "@/components/loading-skeleton"
import { TuitionBookmarkButton } from "@/components/tuition-bookmark"
import { TuitionCard } from "@/components/tuition-card"
import { Button } from "@/components/ui/button"
import { useManagedResource } from "@/hooks/use-managed-resource"
import type { TuitionPage } from "@/lib/tuition-types"

export default function SavedTuitionsPage() {
  const [page, setPage] = useState(1)
  const { data, error, reload } = useManagedResource<TuitionPage>(`/api/tuitions/saved?page=${page}`)

  function onRemove() {
    if (data?.items.length === 1 && page > 1) setPage(page - 1)
    else reload()
  }

  return (
    <section className="mx-auto max-w-7xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Saved Tuitions</h1>
        <Link href="/tuitions" className="text-sm font-semibold underline">Browse tuitions</Link>
      </div>
      {error ? (
        <p role="alert" className="flex flex-wrap items-center gap-2">
          {error.message} <Button type="button" variant="outline" onClick={reload}>Retry</Button>
        </p>
      ) : !data ? (
        <LoadingSkeleton label="Loading saved tuitions…" variant="cards" />
      ) : data.items.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.items.map((tuition) => (
            <TuitionCard key={tuition.id} tuition={tuition} action={
              <TuitionBookmarkButton tuitionId={tuition.id} title={tuition.title} saved onChange={onRemove} />
            } />
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed p-6 text-muted-foreground">
          {page === 1 ? "Open a tuition listing and choose Save tuition to add it here." : "There are no saved tuitions on this page."}
        </p>
      )}
      {data && (page > 1 || data.hasMore) && (
        <nav aria-label="Saved tuition pages" className="flex gap-2">
          {page > 1 && <Button type="button" variant="outline" onClick={() => setPage(page - 1)}>Previous</Button>}
          {data.hasMore && <Button type="button" variant="outline" onClick={() => setPage(page + 1)}>Next</Button>}
        </nav>
      )}
    </section>
  )
}
