"use client"

import { Bookmark, BookmarkCheck } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { useManagedResource } from "@/hooks/use-managed-resource"
import { useSession } from "@/lib/auth-client"
import { authorizedRequest } from "@/lib/managed-api"
import { notifyError, notifySuccess } from "@/lib/notify"

function bookmarkPath(id: string) {
  return `/api/tuitions/saved/${id}`
}

export function TuitionBookmarkButton({ tuitionId, title, saved, onChange }: {
  tuitionId: string
  title?: string
  saved: boolean
  onChange: (saved: boolean) => void
}) {
  const [pending, setPending] = useState(false)
  const label = saved ? "Remove bookmark" : "Save tuition"
  const Icon = saved ? BookmarkCheck : Bookmark

  async function toggle() {
    if (pending) return
    setPending(true)
    const next = !saved
    try {
      await authorizedRequest(bookmarkPath(tuitionId), saved ? "DELETE" : "PUT")
      notifySuccess(next ? "Tuition saved." : "Bookmark removed.")
      onChange(next)
    } catch (error) {
      notifyError(error, "Could not update your bookmark.")
    } finally {
      setPending(false)
    }
  }

  return (
    <Button type="button" size="lg" variant="outline" disabled={pending}
      aria-label={title ? `${label} for ${title}` : undefined} onClick={() => void toggle()}>
      <Icon aria-hidden="true" />
      {pending ? "Saving…" : label}
    </Button>
  )
}

function StudentBookmark({ tuitionId }: { tuitionId: string }) {
  const { data, error, reload } = useManagedResource<{ saved: boolean }>(bookmarkPath(tuitionId))
  const [saved, setSaved] = useState<boolean>()
  const bookmarked = saved ?? data?.saved

  return (
    <div className="mt-5">
      {error ? (
        <p role="alert" className="flex flex-wrap items-center gap-2 text-sm">
          {error.message} <Button type="button" variant="outline" onClick={reload}>Retry</Button>
        </p>
      ) : bookmarked === undefined ? (
        <p role="status" className="text-sm text-muted-foreground">Checking bookmark…</p>
      ) : (
        <TuitionBookmarkButton tuitionId={tuitionId} saved={bookmarked} onChange={setSaved} />
      )}
    </div>
  )
}

export function TuitionBookmark({ tuitionId }: { tuitionId: string }) {
  const { data } = useSession()
  const user = data?.user
  if (user?.role !== "student") return null
  return <StudentBookmark key={user.id} tuitionId={tuitionId} />
}
