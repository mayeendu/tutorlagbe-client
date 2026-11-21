"use client"

import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"

import { ImageUpload, uploadSelectedImage } from "@/components/image-upload"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"
import { courseClass, courseMode, type Course } from "@/lib/course-seeds"
import { authorizedRequest } from "@/lib/managed-api"
import type { Resource } from "@/lib/resource-seeds"

type Props = { kind: "courses"; entry: Course } | { kind: "resources"; entry: Resource; currentImage: string }
type Field = {
  name: string
  label: string
  value: string | number
  max: number
  multiline?: boolean
  options?: readonly string[]
}

const inputClass = "w-full rounded-lg border bg-background px-3 py-2"

function catalogFields(props: Props): Field[] {
  const { entry } = props
  const title = { name: "title", label: "Title", value: entry.title, max: 160 }
  if (props.kind === "courses") {
    const course = props.entry
    return [
      title,
      { name: "topic", label: "Topic", value: course.topic, max: 80 },
      { name: "classLevel", label: "Class level", value: course.classLevel, max: 80, options: courseClass.options },
      { name: "level", label: "Difficulty", value: course.level, max: 80, options: ["Beginner", "Intermediate"] },
      { name: "mode", label: "Format", value: course.mode, max: 80, options: courseMode.options },
      { name: "duration", label: "Duration", value: course.duration, max: 80 },
      { name: "fee", label: "Fee (BDT)", value: course.fee, max: 1000000 },
      { name: "description", label: "Description", value: course.description, max: 4000, multiline: true },
      { name: "outcomes", label: "Learning outcomes (one per line)", value: course.outcomes.join("\n"), max: 6100, multiline: true },
    ]
  }
  const resource = props.entry
  return [
    title,
    { name: "subject", label: "Subject", value: resource.subject, max: 80 },
    { name: "level", label: "Class level", value: resource.level, max: 80 },
    { name: "kind", label: "Material type", value: resource.kind, max: 80 },
    { name: "summary", label: "Summary", value: resource.summary, max: 1000, multiline: true },
    { name: "lesson", label: "Lesson", value: resource.lesson, max: 8000, multiline: true },
    { name: "practice", label: "Practice question", value: resource.practice, max: 4000, multiline: true },
    { name: "answer", label: "Answer", value: resource.answer, max: 4000, multiline: true },
  ]
}

export function CatalogAdminActions(props: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  if (session?.user.role !== "admin") return null

  const isCourse = props.kind === "courses"
  const label = isCourse ? "course" : "resource"
  const path = "/api/catalog/" + props.kind + "/" + props.entry.slug
  const fields = catalogFields(props)

  async function mutate(method: "PATCH" | "DELETE", data?: FormData) {
    if (busy) return
    setBusy(true)
    setError("")
    try {
      let payload: Record<string, string | number | string[]> | undefined
      if (data && uploading) {
        const imageUrl = await uploadSelectedImage(data.get("image"))
        if (!imageUrl) throw new Error("Choose an image first.")
        payload = { imageUrl }
      } else if (data) {
        payload = Object.fromEntries(fields.map(({ name }) => [name, String(data.get(name) ?? "").trim()]))
        if (isCourse) {
          const outcomes = String(payload.outcomes).split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
          if (!outcomes.length || outcomes.length > 20 || outcomes.some((line) => line.length > 300)) {
            throw new Error("Enter 1 to 20 learning outcomes of up to 300 characters each.")
          }
          payload.outcomes = outcomes
          payload.fee = Number(payload.fee)
        }
      }
      await authorizedRequest(path, method, payload)
      if (method === "DELETE") {
        router.replace(isCourse ? "/courses" : "/learning-materials")
      } else {
        setEditing(false)
        setUploading(false)
      }
      router.refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update the catalog.")
    } finally {
      setBusy(false)
    }
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void mutate("PATCH", new FormData(event.currentTarget))
  }

  return (
    <section aria-label={"Manage " + label} className="mt-4 space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" disabled={busy} onClick={() => { setEditing(!editing); setUploading(false); setConfirming(false); setError("") }}>
          {editing ? "Close editor" : "Edit " + label}
        </Button>
        <Button variant="outline" disabled={busy} onClick={() => { setUploading(!uploading); setEditing(false); setConfirming(false); setError("") }}>
          {uploading ? "Close upload" : isCourse ? "Upload course image" : "Change image"}
        </Button>
        <Button variant="destructive" disabled={busy} onClick={() => { setConfirming(true); setEditing(false); setUploading(false); setError("") }}>
          Delete {label}
        </Button>
      </div>
      {confirming && (
        <div className="space-y-3 rounded-xl border bg-card p-4">
          <p>Delete {props.entry.title} from the catalog?</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="destructive" disabled={busy} onClick={() => void mutate("DELETE")}>
              {busy ? "Deleting…" : "Confirm delete"}
            </Button>
            <Button variant="outline" disabled={busy} onClick={() => { setConfirming(false); setError("") }}>Cancel</Button>
          </div>
        </div>
      )}
      {uploading && (
        <form onSubmit={save} className="rounded-xl border bg-card p-4 sm:p-6">
          <fieldset disabled={busy} className="grid gap-4">
            <ImageUpload
              name="image"
              label={isCourse ? "Course cover" : "Learning material cover"}
              currentImage={props.kind === "resources" ? props.currentImage : props.entry.imageUrl}
            />
            <Button type="submit" className="w-fit">{busy ? "Uploading…" : "Save image"}</Button>
          </fieldset>
        </form>
      )}
      {editing && (
        <form onSubmit={save} className="rounded-xl border bg-card p-4 sm:p-6">
          <fieldset disabled={busy} className="grid gap-4 sm:grid-cols-2">
            {fields.map(({ name, label: fieldLabel, value, max, multiline, options }) => (
              <label key={name} className={"grid gap-1.5 text-sm font-medium" + (multiline ? " sm:col-span-2" : "")}>
                {fieldLabel}
                {options ? (
                  <select name={name} defaultValue={value} className={inputClass}>
                    {options.map((option) => <option key={option}>{option}</option>)}
                  </select>
                ) : multiline ? (
                  <textarea name={name} defaultValue={value} required maxLength={max} rows={4} className={inputClass} />
                ) : typeof value === "number" ? (
                  <input name={name} type="number" defaultValue={value} required min={0} max={max} className={inputClass} />
                ) : (
                  <input name={name} defaultValue={value} required maxLength={max} className={inputClass} />
                )}
              </label>
            ))}
            <Button type="submit" className="w-fit">{busy ? "Saving…" : "Save changes"}</Button>
          </fieldset>
        </form>
      )}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </section>
  )
}
