"use client"

import Link from "next/link"
import { useEffect, useState, type FormEvent, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { authClient, useSession } from "@/lib/auth-client"
import { tuitionFee, type TuitionPage } from "@/lib/tuition-types"

const inputClass = "w-full rounded-lg border bg-background px-3 py-2.5 text-base focus-visible:outline-2 focus-visible:outline-ring"
const labelClass = "grid gap-1.5 text-sm font-medium"

async function authorizedRequest(path: string, method = "GET", body?: object, signal?: AbortSignal) {
  const token = await authClient.token()
  if (!token.data?.token) throw new Error("Could not authorize this request. Check your session and try again.")
  const response = await fetch(`/api/tuitions${path}`, {
    method,
    headers: { Authorization: `Bearer ${token.data.token}`, ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    signal,
  })
  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(typeof error?.error === "string" ? error.error : "The tuition request failed. Try again.")
  }
  return response
}

function DashboardAccess({ role, children }: { role: "tutor" | "admin"; children: ReactNode }) {
  const { data, isPending, error } = useSession()
  if (isPending) return <p role="status">Checking your session…</p>
  if (error) return <p role="alert">Your session could not be checked. Refresh and try again.</p>
  if (!data?.user) return <p><Link className="font-semibold underline" href="/sign-in">Sign in</Link> to continue.</p>
  if (data.user.role !== role) return <p role="alert">This page requires {role === "admin" ? "an admin" : "a tutor"} account.</p>
  return children
}

function TuitionForm() {
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<{ error: boolean; text: string }>()

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const form = event.currentTarget
    const data = new FormData(form)
    setPending(true)
    setMessage(undefined)
    try {
      await authorizedRequest("", "POST", {
        title: data.get("title"), subject: data.get("subject"), classLevel: data.get("classLevel"),
        mode: data.get("mode"), location: data.get("location"), monthlyFee: Number(data.get("monthlyFee")),
        daysPerWeek: Number(data.get("daysPerWeek")), description: data.get("description"),
      })
      form.reset()
      setMessage({ error: false, text: "Tuition submitted for admin review." })
    } catch (error) {
      setMessage({ error: true, text: error instanceof Error ? error.message : "Could not submit tuition." })
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border bg-card p-5 sm:p-7">
      <fieldset disabled={pending} className="grid min-w-0 gap-4 sm:grid-cols-2">
        <label className={`${labelClass} sm:col-span-2`}>Title<input name="title" className={inputClass} required minLength={3} maxLength={100} /></label>
        <label className={labelClass}>Subject<input name="subject" className={inputClass} required minLength={2} maxLength={60} /></label>
        <label className={labelClass}>Class level<input name="classLevel" className={inputClass} required minLength={2} maxLength={40} /></label>
        <label className={labelClass}>Mode<select name="mode" className={inputClass}><option>Online</option><option>Offline</option></select></label>
        <label className={labelClass}>Location (required for offline)<input name="location" className={inputClass} maxLength={100} /></label>
        <label className={labelClass}>Monthly fee (BDT)<input name="monthlyFee" type="number" className={inputClass} required min={0} max={1000000} /></label>
        <label className={labelClass}>Days per week<input name="daysPerWeek" type="number" className={inputClass} required min={1} max={7} /></label>
        <label className={`${labelClass} sm:col-span-2`}>Description<textarea name="description" className={inputClass} required minLength={20} maxLength={2000} rows={5} /></label>
        <Button type="submit" className="h-11 w-fit bg-indigo-700 text-white hover:bg-indigo-800">{pending ? "Submitting…" : "Submit for review"}</Button>
      </fieldset>
      {message && <p role={message.error ? "alert" : "status"} className={`mt-4 text-sm ${message.error ? "text-destructive" : "text-foreground"}`}>{message.text}</p>}
    </form>
  )
}

function ModerationQueue() {
  const [page, setPage] = useState(1)
  const [revision, setRevision] = useState(0)
  const [results, setResults] = useState<TuitionPage>()
  const [loading, setLoading] = useState(true)
  const [listingId, setListingId] = useState<string>()
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  useEffect(() => {
    const controller = new AbortController()
    void authorizedRequest(`/moderation?page=${page}`, "GET", undefined, controller.signal)
      .then((response) => response.json())
      .then((items: TuitionPage) => {
        if (!controller.signal.aborted) setResults(items)
      })
      .catch((failure: Error) => {
        if (!controller.signal.aborted) setError(failure.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [page, revision])

  function refresh(number: number) {
    setLoading(true)
    setError("")
    setPage(number)
    setRevision((value) => value + 1)
  }

  async function moderate(id: string, status: "approved" | "rejected") {
    if (listingId || loading) return
    setListingId(id)
    setError("")
    setNotice("")
    try {
      await authorizedRequest(`/${id}/moderation`, "PATCH", { status })
      setNotice(status === "approved" ? "Tuition approved and visible in the catalog." : "Tuition rejected.")
      refresh(page)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not moderate tuition.")
    } finally {
      setListingId(undefined)
    }
  }

  return (
    <div className="space-y-4" aria-busy={loading || Boolean(listingId)}>
      {notice && <p role="status">{notice}</p>}
      {error && <div role="alert" className="flex flex-wrap items-center gap-3 text-destructive">{error}<Button variant="outline" onClick={() => refresh(page)}>Retry queue</Button></div>}
      {loading ? <p role="status">Loading pending tuitions…</p> : !results ? null : results.items.length ? (
        <ul className="grid gap-4">
          {results.items.map((item) => (
            <li key={item.id} className="space-y-3 rounded-2xl border bg-card p-5 [overflow-wrap:anywhere]">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-sm text-muted-foreground">{item.subject} · {item.classLevel} · {item.mode} · {tuitionFee.format(item.monthlyFee)} per month</p>
              <p className="text-sm">{item.tutorName}{item.location && ` · ${item.location}`} · {item.daysPerWeek} days per week</p>
              <p className="whitespace-pre-wrap text-sm">{item.description}</p>
              <div className="flex flex-wrap gap-2">
                <Button disabled={Boolean(listingId)} className="bg-indigo-700 text-white hover:bg-indigo-800" onClick={() => void moderate(item.id, "approved")}>Approve</Button>
                <Button disabled={Boolean(listingId)} variant="outline" onClick={() => void moderate(item.id, "rejected")}>Reject</Button>
              </div>
            </li>
          ))}
        </ul>
      ) : <p className="rounded-xl border border-dashed p-5 text-muted-foreground">No pending tuitions on this page.</p>}
      {!loading && (page > 1 || results?.hasMore) && (
        <nav aria-label="Moderation pages" className="flex gap-2">
          {page > 1 && <Button disabled={Boolean(listingId)} variant="outline" onClick={() => refresh(page - 1)}>Previous page</Button>}
          {results?.hasMore && <Button disabled={Boolean(listingId)} variant="outline" onClick={() => refresh(page + 1)}>Next page</Button>}
        </nav>
      )}
    </div>
  )
}

export function TuitionDashboard({ role }: { role: "tutor" | "admin" }) {
  const tutor = role === "tutor"
  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <Link href="/tuitions" className="text-sm font-semibold text-indigo-700 hover:underline dark:text-indigo-300">Browse public tuitions</Link>
      <h1 className="mt-4 mb-6 text-4xl font-bold tracking-tight">{tutor ? "Post a tuition" : "Review tuitions"}</h1>
      <DashboardAccess role={role}>{tutor ? <TuitionForm /> : <ModerationQueue />}</DashboardAccess>
    </main>
  )
}
