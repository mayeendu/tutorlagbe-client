"use client"

import { useEffect } from "react"

import { notifyError, notifySuccess } from "@/lib/notify"

export function ToastFeedback({ message, success = false }: { message: string; success?: boolean }) {
  useEffect(() => {
    if (success) notifySuccess(message)
    else notifyError(undefined, message)
  }, [message, success])

  return null
}
