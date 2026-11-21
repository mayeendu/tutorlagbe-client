"use client"

import { useEffect, useState, type FormEvent } from "react"

import { ImageUpload, uploadSelectedImage } from "@/components/image-upload"
import { Button } from "@/components/ui/button"
import { authorizedRequest } from "@/lib/managed-api"
import { tuitionFee, type ManagedTuition, type ManagedTuitionPage } from "@/lib/tuition-types"

const inputClass = "w-full rounded-lg border bg-background px-3 py-2.5 text-base focus-visible:outline-2 focus-visible:outline-ring"
const labelClass = "grid gap-1.5 text-sm font-medium"

export function TuitionForm({ item, onSaved, onCancel }: {
  item?: ManagedTuition
  onSaved?: (item: ManagedTuition) => void
  onCancel?: () => void
}) {
  const [pending, setPending] = useState(false)
  const [imageReset, setImageReset] = useState(0)
  const [message, setMessage] = useState<{ error: boolean; text: string }>()

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const form = event.currentTarget
    const data = new FormData(form)
    setPending(true)
    setMessage(undefined)
    try {
      const bannerImage = await uploadSelectedImage(data.get("bannerFile"))
      const response = await authorizedRequest(item ? `/api/tuitions/manage/${item.id}` : "/api/tuitions", item ? "PATCH" : "POST", {
        title: data.get("title"), subject: data.get("subject"), classLevel: data.get("classLevel"),
        mode: data.get("mode"), location: data.get("location"), monthlyFee: Number(data.get("monthlyFee")),
        daysPerWeek: Number(data.get("daysPerWeek")), description: data.get("description"),
        bannerImage,
      })
      if (item && onSaved) onSaved(await response.json())
      else {
        form.reset()
        setImageReset((value) => value + 1)
        setMessage({ error: false, text: "Tuition submitted for admin review." })
      }
    } catch (error) {
      setMessage({ error: true, text: error instanceof Error ? error.message : "Could not submit tuition." })
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border bg-card p-5 sm:p-7">
      <fieldset disabled={pending} className="grid min-w-0 gap-4 sm:grid-cols-2">
        <label className={`${labelClass} sm:col-span-2`}>Title<input name="title" defaultValue={item?.title} className={inputClass} required minLength={3} maxLength={100} /></label>
        <label className={labelClass}>Subject<input name="subject" defaultValue={item?.subject} className={inputClass} required minLength={2} maxLength={60} /></label>
        <label className={labelClass}>Class level<input name="classLevel" defaultValue={item?.classLevel} className={inputClass} required minLength={2} maxLength={40} /></label>
        <label className={labelClass}>Mode<select name="mode" defaultValue={item?.mode} className={inputClass}><option>Online</option><option>Offline</option></select></label>
        <label className={labelClass}>Location (required for offline)<input name="location" defaultValue={item?.location} className={inputClass} maxLength={100} /></label>
        <label className={labelClass}>Monthly fee (BDT)<input name="monthlyFee" type="number" defaultValue={item?.monthlyFee} className={inputClass} required min={0} max={1000000} /></label>
        <label className={labelClass}>Days per week<input name="daysPerWeek" type="number" defaultValue={item?.daysPerWeek} className={inputClass} required min={1} max={7} /></label>
        <label className={`${labelClass} sm:col-span-2`}>Description<textarea name="description" defaultValue={item?.description} className={inputClass} required minLength={20} maxLength={2000} rows={5} /></label>
        <div className="sm:col-span-2"><ImageUpload key={imageReset} name="bannerFile" label="Upload tuition banner" currentImage={item?.bannerImage} /></div>
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <Button type="submit" className="h-11 bg-indigo-700 text-white hover:bg-indigo-800">{pending ? "Saving…" : item ? "Save changes" : "Submit for review"}</Button>
          {onCancel && <Button type="button" variant="outline" className="h-11" onClick={onCancel}>Cancel</Button>}
        </div>
      </fieldset>
      {message && <p role={message.error ? "alert" : "status"} className={`mt-4 text-sm ${message.error ? "text-destructive" : "text-foreground"}`}>{message.text}</p>}
    </form>
  )
}

function ModerationQueue() {
  const [page, setPage] = useState(1)
  const [revision, setRevision] = useState(0)
  const [results, setResults] = useState<ManagedTuitionPage>()
  const [loading, setLoading] = useState(true)
  const [listingId, setListingId] = useState<string>()
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  useEffect(() => {
    const controller = new AbortController()
    void authorizedRequest(`/api/tuitions/moderation?page=${page}`, "GET", undefined, controller.signal)
      .then((response) => response.json())
      .then((items: ManagedTuitionPage) => {
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

  async function moderate(item: ManagedTuition, status: "approved" | "rejected") {
    if (listingId || loading) return
    setListingId(item.id)
    setError("")
    setNotice("")
    try {
      await authorizedRequest(`/api/tuitions/${item.id}/moderation`, "PATCH", { status, revision: item.revision })
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
            <li key={item.id} className="space-y-3 rounded-2xl border bg-card p-5 wrap-anywhere">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-sm text-muted-foreground">{item.subject} · {item.classLevel} · {item.mode} · {tuitionFee.format(item.monthlyFee)} per month</p>
              <p className="text-sm">{item.tutorName}{item.location && ` · ${item.location}`} · {item.daysPerWeek} days per week</p>
              <p className="whitespace-pre-wrap text-sm">{item.description}</p>
              <div className="flex flex-wrap gap-2">
                <Button disabled={Boolean(listingId)} className="bg-indigo-700 text-white hover:bg-indigo-800" onClick={() => void moderate(item, "approved")}>Approve</Button>
                <Button disabled={Boolean(listingId)} variant="outline" onClick={() => void moderate(item, "rejected")}>Reject</Button>
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
    <section className="mx-auto max-w-5xl">
      <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">{tutor ? "Add course" : "Tuition approvals"}</h1>
      {tutor ? <TuitionForm /> : <ModerationQueue />}
    </section>
  )
}
