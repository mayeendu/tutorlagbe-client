"use client"

import { Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import type { StudentApplication, TuitionReview } from "@/lib/application-types"
import { ApiError, authorizedRequest } from "@/lib/managed-api"
import { notifyError, notifyInvalidForm, notifySuccess } from "@/lib/notify"

export function TuitionReviewForm({ application, reload }: { application: StudentApplication; reload: () => void }) {
  const [rating, setRating] = useState<number>()
  const [submitted, setSubmitted] = useState<TuitionReview>()
  const [pending, setPending] = useState(false)
  const [failure, setFailure] = useState("")
  const router = useRouter()
  const review = submitted ?? application.review

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending || rating === undefined) return
    const fields = new FormData(event.currentTarget)
    setPending(true)
    setFailure("")
    try {
      const response = await authorizedRequest(`/api/applications/${application.id}/review`, "POST", {
        rating, feedback: fields.get("feedback"),
      })
      setSubmitted(await response.json())
      notifySuccess("Review submitted.")
      router.refresh()
    } catch (error) {
      setFailure(notifyError(error, "Could not submit your review."))
      if (error instanceof ApiError && error.status === 409) {
        reload()
        router.refresh()
      }
    } finally {
      setPending(false)
    }
  }

  if (review) return <p role="status" className="text-sm">You rated this tuition {review.rating} out of 5 stars.</p>

  return (
    <form onSubmit={submit} onInvalid={notifyInvalidForm} className="mt-4 space-y-4 rounded-xl border bg-muted/30 p-4">
      <fieldset disabled={pending} className="space-y-3">
        <legend className="mb-2 font-semibold">Rate this tuition</legend>
        <div className="flex flex-wrap gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value}>
              <input type="radio" name="rating" value={value} required checked={rating === value}
                onChange={() => setRating(value)} className="peer sr-only" />
              <span className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
                <Star aria-hidden="true" className={`size-6 ${value <= (rating ?? 0) ? "fill-current text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`} />
                <span className="sr-only">{value} {value === 1 ? "star" : "stars"}</span>
              </span>
            </label>
          ))}
        </div>
        <label className="grid gap-2 text-sm font-medium">
          Public feedback
          <textarea name="feedback" required maxLength={1000} rows={4} className="rounded-lg border bg-background px-3 py-2" />
        </label>
        <Button type="submit" className="h-11 bg-indigo-700 text-white hover:bg-indigo-800">
          {pending ? "Submitting…" : "Submit review"}
        </Button>
      </fieldset>
      {failure && <p role="alert" className="text-sm text-destructive">{failure}</p>}
    </form>
  )
}
