"use client"

import Link from "next/link"
import { useState } from "react"

import { LoadingSkeleton } from "@/components/loading-skeleton"
import { ApplicationBadge } from "@/components/application-status"
import { Button } from "@/components/ui/button"
import { notifyError, notifySuccess } from "@/lib/notify"
import { useManagedResource } from "@/hooks/use-managed-resource"
import type { ApplicationPage, ReceivedApplication, StudentApplication } from "@/lib/application-types"
import { ApiError, authorizedRequest } from "@/lib/managed-api"
import { tuitionFee } from "@/lib/tuition-types"

type Item = StudentApplication | ReceivedApplication
type Action = { id: string; title: string; decision: "cancel" | "accepted" | "rejected" }
const date = new Intl.DateTimeFormat("en-BD", { dateStyle: "medium", timeZone: "Asia/Dhaka" })

function ApplicationDetails({ item }: { item: Item }) {
  if ("studentName" in item) {
    return (
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div><dt className="text-muted-foreground">Student</dt><dd>{item.studentName}</dd></div>
        <div><dt className="text-muted-foreground">Email</dt><dd>{item.studentEmail}</dd></div>
        <div><dt className="text-muted-foreground">Phone</dt><dd>{item.studentPhone}</dd></div>
        <div><dt className="text-muted-foreground">Preferred schedule</dt><dd>{item.preferredSchedule}</dd></div>
        {item.studentNote && <div className="sm:col-span-2"><dt className="text-muted-foreground">Learning note</dt><dd className="whitespace-pre-wrap">{item.studentNote}</dd></div>}
      </dl>
    )
  }
  return (
    <dl className="grid gap-3 text-sm sm:grid-cols-2">
      <div><dt className="text-muted-foreground">Teacher</dt><dd>{item.tutorName}</dd></div>
      <div><dt className="text-muted-foreground">Teacher email</dt><dd>{item.tutorEmail}</dd></div>
      <div><dt className="text-muted-foreground">Monthly fee when applied</dt><dd>{tuitionFee.format(item.monthlyFee)}</dd></div>
      <div><dt className="text-muted-foreground">Preferred schedule</dt><dd>{item.preferredSchedule}</dd></div>
    </dl>
  )
}

export function ApplicationDashboard({ role, acceptedOnly }: { role: "student"; acceptedOnly?: boolean } | { role: "tutor"; acceptedOnly?: never }) {
  const tutor = role === "tutor"
  const [page, setPage] = useState(1)
  const [action, setAction] = useState<Action>()
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState("")
  const [failure, setFailure] = useState("")
  const { data, error, reload } = useManagedResource<ApplicationPage<Item>>(
    `/api/applications/${tutor ? "received" : "mine"}?page=${page}${acceptedOnly ? "&status=accepted" : ""}`, 15_000,
  )

  async function confirm() {
    if (!action || busy) return
    setBusy(true)
    setFailure("")
    setNotice("")
    try {
      const path = `/api/applications/${action.id}`
      if (action.decision === "cancel") await authorizedRequest(path, "DELETE")
      else await authorizedRequest(`${path}/status`, "PATCH", { status: action.decision })
      const message = action.decision === "cancel" ? "Application cancelled." : `Application ${action.decision}.`
      setNotice(message)
      notifySuccess(message)
      setAction(undefined)
      if (action.decision === "cancel" && data?.items.length === 1 && page > 1) setPage(page - 1)
      reload()
    } catch (error) {
      setFailure(notifyError(error, "Could not update this application."))
      if (error instanceof ApiError && (error.status === 404 || error.status === 409)) {
        setAction(undefined)
        reload()
      }
    } finally {
      setBusy(false)
    }
  }

  function changePage(number: number) {
    setAction(undefined)
    setFailure("")
    setPage(number)
  }

  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight">{acceptedOnly ? "My courses" : tutor ? "Course applications" : "My applications"}</h1>
        <Button variant="outline" disabled={busy} onClick={() => { setAction(undefined); setFailure(""); reload() }}>Refresh</Button>
      </div>
      {notice && <p role="status">{notice}</p>}
      {failure && <p role="alert" className="text-destructive">{failure}</p>}
      {error ? <p role="alert" className="rounded-xl border bg-card p-5">{error.message}</p> : !data ? (
        <LoadingSkeleton label={acceptedOnly ? "Loading courses…" : "Loading applications…"} />
      ) : data.items.length ? (
        <ul className="grid gap-4">
          {data.items.map((item) => (
            <li key={item.id} className="space-y-4 rounded-2xl border bg-card p-5 wrap-anywhere sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{item.tuitionTitle}</h2>
                  <p className="text-sm text-muted-foreground">{item.subject} · Applied {date.format(new Date(item.appliedAt))}</p>
                </div>
                <ApplicationBadge status={item.status} />
              </div>
              <ApplicationDetails item={item} />
              {acceptedOnly && (
                <Link href={`/tuitions/${item.tuitionId}`} className="text-sm font-semibold underline">
                  View course details<span className="sr-only"> for {item.tuitionTitle}</span>
                </Link>
              )}
              {item.status === "pending" && (
                <div className="flex flex-wrap gap-2 border-t pt-4">
                  {tutor ? (
                    <>
                      <Button disabled={busy} onClick={() => setAction({ id: item.id, title: item.tuitionTitle, decision: "accepted" })}>Accept</Button>
                      <Button variant="outline" disabled={busy} onClick={() => setAction({ id: item.id, title: item.tuitionTitle, decision: "rejected" })}>Reject</Button>
                    </>
                  ) : <Button variant="outline" disabled={busy} onClick={() => setAction({ id: item.id, title: item.tuitionTitle, decision: "cancel" })}>Cancel application</Button>}
                  {action?.id === item.id && (
                    <div className="w-full rounded-xl border bg-muted/30 p-4" aria-busy={busy}>
                      <p className="text-sm font-medium">{action.decision === "cancel" ? "Cancel your application" : action.decision === "accepted" ? "Accept this application" : "Reject this application"} for {action.title}?</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button disabled={busy} onClick={() => void confirm()}>{busy ? "Saving…" : "Confirm"}</Button>
                        <Button variant="outline" disabled={busy} onClick={() => setAction(undefined)}>Go back</Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="space-y-3 rounded-xl border border-dashed p-5 text-muted-foreground">
          <p>{acceptedOnly ? (page === 1 ? "You have no tutor-approved courses yet." : "No courses on this page.") : "No applications on this page."}</p>
          {!tutor && <Link href="/tuitions" className="font-semibold underline">Browse tuitions</Link>}
        </div>
      )}
      {data && (page > 1 || data.hasMore) && (
        <nav aria-label={acceptedOnly ? "Course pages" : "Application pages"} className="flex flex-wrap gap-2">
          {page > 1 && <Button variant="outline" disabled={busy} onClick={() => changePage(page - 1)}>Previous page</Button>}
          {data.hasMore && <Button variant="outline" disabled={busy} onClick={() => changePage(page + 1)}>Next page</Button>}
        </nav>
      )}
    </section>
  )
}
