import { toast } from "sonner"

export function notifySuccess(message: string) {
  toast.success(message, { toasterId: "tuition" })
}

export function notifyError(error: unknown, fallback: string) {
  const message = error instanceof Error && error.message ? error.message : fallback
  toast.error(message, { id: message, toasterId: "tuition" })
  return message
}

export function notifyInvalidForm() {
  notifyError(undefined, "Check the highlighted fields and try again.")
}
