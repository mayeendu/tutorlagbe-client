"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { DeleteRecord } from "@/components/delete-record"
import { TuitionForm } from "@/components/tuition-dashboard"
import { Button } from "@/components/ui/button"
import { useManagedResource } from "@/hooks/use-managed-resource"
import { useSession } from "@/lib/auth-client"
import { tuitionFee, type ManagedTuition, type ManagedTuitionPage } from "@/lib/tuition-types"

export function PublicTuitionActions({ id }: { id: string }) {
  const router = useRouter()
  const { data } = useSession()
  const role = data?.user.role
  const canCheck = role === "tutor" || role === "admin"
  const path = `/api/tuitions/manage/${id}`
  const { data: managed } = useManagedResource<ManagedTuition>(canCheck ? path : null)
  if (!canCheck || !managed) return null
  return (
    <div className="mt-6 flex flex-wrap gap-2 border-t pt-5">
      <Link href={`/dashboard/${role}/courses/${id}?edit=1`} className="rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-muted">Edit course</Link>
      <DeleteRecord label="course" path={path} onDeleted={() => { router.replace("/tuitions"); router.refresh() }} />
    </div>
  )
}

export function ManagedTuitionDetail({ id, role, startEditing }: { id: string; role: "tutor" | "admin"; startEditing: boolean }) {
  const router = useRouter()
  const [editing, setEditing] = useState(startEditing)
  const [saved, setSaved] = useState<ManagedTuition>()
  const path = `/api/tuitions/manage/${id}`
  const { data, error, reload } = useManagedResource<ManagedTuition>(path)
  const item = saved ?? data
  const home = role === "tutor" ? "/dashboard/tutor/my-tuitions" : "/dashboard/admin/courses"
  if (error) return <div><Link href={home} className="underline">Back to courses</Link><p role="alert" className="mt-4">{error.message}</p><Button className="mt-4" variant="outline" onClick={reload}>Retry</Button></div>
  if (!item) return <p role="status">Loading course…</p>
  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <Link href={home} className="text-sm font-semibold underline">Back to courses</Link>
      <h1 className="text-3xl font-bold [overflow-wrap:anywhere]">{item.title}</h1>
      {saved && <p role="status">{role === "tutor" ? "Changes saved and submitted for admin review." : "Changes saved."}</p>}
      {editing ? (
        <TuitionForm item={item} onCancel={() => setEditing(false)} onSaved={(updated) => { setSaved(updated); setEditing(false) }} />
      ) : (
        <div className="space-y-4 rounded-2xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">{item.subject} · {item.classLevel} · {item.mode} · {tuitionFee.format(item.monthlyFee)} per month</p>
          <p className="text-sm font-semibold capitalize">{item.approvalStatus}{!item.isActive && " · Closed"}</p>
          <p className="whitespace-pre-wrap [overflow-wrap:anywhere]">{item.description}</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setEditing(true)}>Edit course</Button>
            <DeleteRecord label="course" path={path} onDeleted={() => { router.replace(home); router.refresh() }} />
          </div>
        </div>
      )}
    </section>
  )
}

export function ManagedTuitionList({ role }: { role: "tutor" | "admin" }) {
  const [page, setPage] = useState(1)
  const { data, error, reload } = useManagedResource<ManagedTuitionPage>(`/api/tuitions/manage?page=${page}`)
  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <h1 className="text-3xl font-bold tracking-tight">{role === "tutor" ? "My courses" : "All courses"}</h1>
      {error ? <div role="alert">{error.message} <Button variant="outline" onClick={reload}>Retry</Button></div> : !data ? <p role="status">Loading courses…</p> : data.items.length ? (
        <ul className="space-y-3">
          {data.items.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4">
              <div className="min-w-0 [overflow-wrap:anywhere]">
                <h2 className="font-semibold">{item.title}</h2>
                <p className="text-sm text-muted-foreground capitalize">{item.approvalStatus} · {item.tutorName}</p>
              </div>
              <Link className="text-sm font-semibold underline" href={`/dashboard/${role}/courses/${item.id}`}>Manage course<span className="sr-only"> {item.title}</span></Link>
            </li>
          ))}
        </ul>
      ) : <p className="text-muted-foreground">No courses on this page.</p>}
      {data && (page > 1 || data.hasMore) && <nav aria-label="Course management pages" className="flex gap-2">
        {page > 1 && <Button variant="outline" onClick={() => setPage(page - 1)}>Previous page</Button>}
        {data.hasMore && <Button variant="outline" onClick={() => setPage(page + 1)}>Next page</Button>}
      </nav>}
    </section>
  )
}
