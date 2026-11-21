export function apiUrl(path: string) {
  const origin = URL.parse(process.env.TUTORLAGBE_API_URL?.trim() ?? "")
  if (
    !origin || !["http:", "https:"].includes(origin.protocol) ||
    origin.pathname !== "/" || origin.username || origin.password ||
    origin.search || origin.hash
  ) return null

  origin.pathname = path
  return origin
}

export async function readTuitions(path = "") {
  const url = apiUrl("/api/tuitions")
  if (!url) {
    console.warn("[Tuitions] TUTORLAGBE_API_URL is missing or is not an HTTP(S) origin.")
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
