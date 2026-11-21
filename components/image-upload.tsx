"use client"

import Image from "next/image"
import { useEffect, useId, useState, type ChangeEvent } from "react"

import { authorizedRequest } from "@/lib/managed-api"

const formats = ["image/jpeg", "image/png", "image/webp"]
const maxBytes = 3 * 1024 * 1024

export async function uploadSelectedImage(value: FormDataEntryValue | null) {
  if (!(value instanceof File) || !value.size) return undefined

  const data = new FormData()
  data.set("image", value)
  const response = await authorizedRequest("/api/uploads", "POST", data)
  const result: { imageUrl?: string } = await response.json()
  if (!result.imageUrl) throw new Error("The upload did not return an image URL.")
  return result.imageUrl
}

export function ImageUpload({ name, label, currentImage, form, disabled }: {
  name: string
  label: string
  currentImage?: string | null
  form?: string
  disabled?: boolean
}) {
  const hintId = useId()
  const errorId = useId()
  const [preview, setPreview] = useState<string>()
  const [failedPreview, setFailedPreview] = useState<string>()
  const [error, setError] = useState("")

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview) }
  }, [preview])

  function choose(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget
    const file = input.files?.[0]
    setPreview(undefined)
    setError("")
    input.setCustomValidity("")
    if (!file) return

    const message = !file.size || (file.type && !formats.includes(file.type))
      ? "Choose a JPEG, PNG, or WebP image."
      : file.size > maxBytes ? "The image must be 3 MB or smaller." : ""
    if (message) {
      input.value = ""
      input.setCustomValidity(message)
      setError(message)
      return
    }
    setPreview(URL.createObjectURL(file))
  }

  const source = preview ?? currentImage
  return (
    <div className="grid gap-2 text-sm">
      <label className="grid gap-1.5 font-medium">
        {label}
        <input name={name} type="file" accept={formats.join(",")} form={form} disabled={disabled}
          aria-describedby={error ? hintId + " " + errorId : hintId}
          aria-invalid={Boolean(error)} onChange={choose}
          className="w-full rounded-lg border bg-background px-3 py-2 file:me-3 file:font-medium" />
      </label>
      <p id={hintId} className="text-muted-foreground">JPEG, PNG, or WebP up to 3 MB. Uploads when you save.</p>
      {error && <p id={errorId} role="alert" className="text-destructive">{error}</p>}
      {source && (source === failedPreview
        ? <p role="status" className="text-muted-foreground">Image preview unavailable.</p>
        : <Image src={source} alt={label + " preview"} width={240} height={144}
            unoptimized referrerPolicy="no-referrer" onError={() => setFailedPreview(source)}
            className="h-36 w-60 max-w-full rounded-lg border object-contain" />)}
    </div>
  )
}
