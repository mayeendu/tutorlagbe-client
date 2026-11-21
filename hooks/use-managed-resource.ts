import { useEffect, useState } from "react"

import { ApiError, authorizedRequest } from "@/lib/managed-api"

export function useManagedResource<T>(path: string | null, refreshInterval?: number) {
  const [result, setResult] = useState<{ path: string; data?: T; error?: ApiError }>()
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    if (!path) return
    const endpoint = path
    const controller = new AbortController()
    let loading = false
    function load() {
      if (loading) return
      loading = true
      void authorizedRequest(endpoint, "GET", undefined, controller.signal)
        .then((response) => response.json())
        .then((data: T) => { if (!controller.signal.aborted) setResult({ path: endpoint, data }) })
        .catch((error: Error) => {
          if (!controller.signal.aborted) setResult({ path: endpoint, error: error instanceof ApiError ? error : new ApiError("Could not connect. Try again.", 503) })
        })
        .finally(() => { loading = false })
    }
    load()
    const timer = refreshInterval ? window.setInterval(() => { if (!document.hidden) load() }, refreshInterval) : undefined
    return () => {
      controller.abort()
      window.clearInterval(timer)
    }
  }, [path, refreshInterval, revision])
  return {
    data: path && result?.path === path ? result.data : undefined,
    error: path && result?.path === path ? result.error : undefined,
    reload: () => { setResult(undefined); setRevision((value) => value + 1) },
  }
}
