import { authClient } from "@/lib/auth-client"

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) { super(message) }
}

export async function authorizedRequest(path: string, method = "GET", body?: object, signal?: AbortSignal) {
  const token = await authClient.token(undefined, { signal })
  if (!token.data?.token) throw new ApiError("Could not authorize this request. Check your session and try again.", token.error?.status ?? 401)
  const response = await fetch(path, {
    method,
    headers: { Authorization: `Bearer ${token.data.token}`, ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    signal,
  })
  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new ApiError(typeof error?.error === "string" ? error.error : "The request failed. Try again.", response.status)
  }
  return response
}
