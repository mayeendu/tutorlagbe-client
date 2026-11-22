import { existsSync } from "node:fs"
import { resolve } from "node:path"

export function apiOriginSetting() {
  const configured = process.env.TUTORLAGBE_API_URL?.trim()
  if (configured) return configured
  if (!process.env.VERCEL && existsSync(resolve(process.cwd(), "../tutorlagbe-server/api/start.ts"))) {
    return "http://127.0.0.1:8000"
  }
  return undefined
}

export function apiUrl(path: string) {
  const origin = URL.parse(apiOriginSetting() ?? "")
  if (
    !origin || !["http:", "https:"].includes(origin.protocol) ||
    origin.pathname !== "/" || origin.username || origin.password ||
    origin.search || origin.hash
  ) return null

  origin.pathname = path
  return origin
}

export function isFrontendApiTarget(target: URL, requestUrl?: URL) {
  return target.origin === requestUrl?.origin ||
    target.host === process.env.VERCEL_URL ||
    target.host === process.env.VERCEL_PROJECT_PRODUCTION_URL
}

export async function readTuitions(path = "") {
  const url = apiUrl("/api/tuitions")
  if (!url) {
    console.warn("[Tuitions] TUTORLAGBE_API_URL is missing or is not an HTTP(S) origin.")
    return null
  }
  if (isFrontendApiTarget(url)) {
    console.warn("[Tuitions] TUTORLAGBE_API_URL points to the Next.js deployment.")
    return null
  }
  const target = new URL(`/api/tuitions${path}`, url)
  const endpoint = target.pathname.replace(/[\da-f]{24}(?=\/|$)/gi, ":id")
  try {
    const response = await fetch(target, {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(7000),
    })
    if (!response.ok && !(response.status === 404 && endpoint === "/api/tuitions/:id")) {
      console.warn("[Tuitions] API request failed.", { endpoint, status: response.status })
    } else if (response.ok && !response.headers.get("content-type")?.includes("application/json")) {
      console.warn("[Tuitions] API returned non-JSON content.", { endpoint, status: response.status })
    }
    return response
  } catch (error) {
    const cause = error instanceof Error ? error.cause : undefined
    const code = cause && typeof cause === "object" && "code" in cause ? cause.code : undefined
    const networkCodes = ["EACCES", "EPERM", "ECONNREFUSED", "ECONNRESET", "ENOTFOUND", "ETIMEDOUT"]
    console.warn("[Tuitions] Could not reach the API.", {
      endpoint,
      reason: typeof code === "string" && networkCodes.includes(code) ? code
        : error instanceof Error && error.name === "TimeoutError" ? "timeout" : "fetch_failed",
    })
    return null
  }
}
