import { authClient } from "@/lib/auth-client"

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) { super(message) }
}

export async function authorizedRequest(path: string, method = "GET", body?: object, signal?: AbortSignal) {
  const token = await authClient.token(undefined, { signal }).catch((error: unknown) => {
    if (signal?.aborted) throw error
    throw new ApiError("Could not connect to TutorLagbe authentication. Try again shortly.", 503)
  })
  if (!token.data?.token) {
    const status = token.error?.status ?? 503
    const message = status === 401 || status === 403
      ? "Your session is no longer valid. Sign in again to continue."
      : status === 404
        ? "Dashboard access needs Express authentication. Start the full stack and try again."
        : status >= 500 && token.error?.message
          ? token.error.message
          : "TutorLagbe authentication is temporarily unavailable. Try again shortly."
    throw new ApiError(message, status)
  }
  const multipart = body instanceof FormData
  const response = await fetch(path, {
    method,
    headers: { Authorization: `Bearer ${token.data.token}`, ...(body && !multipart ? { "Content-Type": "application/json" } : {}) },
    body: multipart ? body : body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    signal,
  })
  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new ApiError(typeof error?.error === "string" ? error.error : "The request failed. Try again.", response.status)
  }
  return response
}
