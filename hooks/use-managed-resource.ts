import { useEffect, useState } from "react"

import { ApiError, authorizedRequest } from "@/lib/managed-api"

export function useManagedResource<T>(path: string | null) {
  const [result, setResult] = useState<{ path: string; data?: T; error?: ApiError }>()
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    if (!path) return
    const controller = new AbortController()
    void authorizedRequest(path, "GET", undefined, controller.signal)
      .then((response) => response.json())
      .then((data: T) => { if (!controller.signal.aborted) setResult({ path, data }) })
      .catch((error: Error) => {
        if (!controller.signal.aborted) setResult({ path, error: error instanceof ApiError ? error : new ApiError("Could not connect. Try again.", 503) })
      })
    return () => controller.abort()
  }, [path, revision])
  return {
    data: path && result?.path === path ? result.data : undefined,
    error: path && result?.path === path ? result.error : undefined,
    reload: () => { setResult(undefined); setRevision((value) => value + 1) },
  }
}
