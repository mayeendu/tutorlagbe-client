"use client"

import Link from "next/link"
import { useState, type FormEvent } from "react"

import { ApplicationBadge } from "@/components/application-status"
import { Button } from "@/components/ui/button"
import { notifyError, notifyInvalidForm, notifySuccess } from "@/lib/notify"
import { useManagedResource } from "@/hooks/use-managed-resource"
import type { ApplicationPage, StudentApplication } from "@/lib/application-types"
import { useSession } from "@/lib/auth-client"
import { ApiError, authorizedRequest } from "@/lib/managed-api"

const input = "rounded-lg border bg-background px-3 py-2.5 text-base"

function StudentApplyForm({ tuitionId }: { tuitionId: string }) {
  const { data, error, reload } = useManagedResource<ApplicationPage<StudentApplication>>(`/api/applications/mine?tuitionId=${tuitionId}`)
  const [submitted, setSubmitted] = useState<StudentApplication>()
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState("")
  const application = submitted ?? data?.items[0]

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const values = new FormData(event.currentTarget)
    setPending(true)
    setMessage("")
    try {
      const response = await authorizedRequest("/api/applications", "POST", {
        tuitionId, studentPhone: values.get("studentPhone"),
        preferredSchedule: values.get("preferredSchedule"), studentNote: values.get("studentNote"),
      })
      setSubmitted(await response.json())
      notifySuccess("Application submitted.")
    } catch (failure) {
      setMessage(notifyError(failure, "Could not submit your application."))
      if (failure instanceof ApiError && failure.status === 409) reload()
    } finally {
      setPending(false)
    }
  }

  if (application) return (
    <div className="space-y-3">
      <p role="status" className="flex flex-wrap items-center gap-2">{submitted ? "Application submitted." : "You already applied for this tuition."} <ApplicationBadge status={application.status} /></p>
      <Link className="text-sm font-semibold underline" href="/dashboard/student/my-applications">View my applications</Link>
    </div>
  )
  if (error) return <p role="alert">{error.message} <Button variant="outline" onClick={reload}>Retry</Button></p>
  if (!data) return <p role="status">Checking your applications…</p>

  return (
    <form onSubmit={submit} onInvalid={notifyInvalidForm} className="space-y-4">
      <fieldset disabled={pending} className="grid min-w-0 gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium">Phone number<input className={input} name="studentPhone" type="tel" autoComplete="tel" required minLength={7} maxLength={30} /></label>
        <label className="grid gap-1.5 text-sm font-medium">Preferred schedule<input className={input} name="preferredSchedule" placeholder="e.g. Weekdays after 5 PM" required minLength={3} maxLength={160} /></label>
        <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">Learning note (optional)<textarea className={input} name="studentNote" rows={4} maxLength={1000} /></label>
        <Button type="submit" className="h-11 w-fit bg-indigo-700 text-white hover:bg-indigo-800">{pending ? "Submitting…" : "Submit application"}</Button>
      </fieldset>
      {message && <p role="alert" className="text-sm text-destructive">{message}</p>}
    </form>
  )
}

export function ApplyForTuition({ tuitionId }: { tuitionId: string }) {
  const { data, error, isPending } = useSession()
  const student = data?.user.role === "student" ? data.user : undefined
  return (
    <section aria-labelledby="tuition-apply-title" className="mt-7 space-y-4 border-t pt-6">
      <h2 id="tuition-apply-title" className="text-xl font-semibold">Apply for tuition</h2>
      {isPending ? <p role="status">Checking your session…</p> : error ? (
        <p role="alert">Your session could not be checked. Refresh to try again.</p>
      ) : !data?.user ? (
        <p><Link href="/sign-in" className="font-semibold underline">Sign in as a student</Link> to apply.</p>
      ) : student ? (
        <StudentApplyForm key={`${student.id}:${tuitionId}`} tuitionId={tuitionId} />
      ) : <p className="text-muted-foreground">Only student accounts can apply.</p>}
    </section>
  )
}
