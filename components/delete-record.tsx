"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { notifyError, notifySuccess } from "@/lib/notify"
import { authorizedRequest } from "@/lib/managed-api"

export function DeleteRecord({ label, path, onDeleted }: { label: string; path: string; onDeleted: () => void }) {
  const [confirming, setConfirming] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")

  async function remove() {
    if (pending) return
    setPending(true)
    setError("")
    try {
      await authorizedRequest(path, "DELETE")
      notifySuccess(`Deleted ${label}.`)
      onDeleted()
    } catch (failure) {
      setError(notifyError(failure, "Could not delete this record."))
    } finally {
      setPending(false)
    }
  }

  if (!confirming) return <Button type="button" variant="destructive" onClick={() => setConfirming(true)}>Delete {label}</Button>
  return (
    <div className="w-full rounded-lg border border-destructive/50 p-4" aria-busy={pending}>
      <p className="text-sm font-semibold">Permanently delete this {label}?</p>
      {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" variant="destructive" disabled={pending} onClick={() => void remove()}>{pending ? "Deleting…" : "Confirm deletion"}</Button>
        <Button type="button" variant="outline" disabled={pending} onClick={() => { setConfirming(false); setError("") }}>Cancel</Button>
      </div>
    </div>
  )
}
