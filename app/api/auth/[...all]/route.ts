import { safeEmailAuthResponse } from "@/lib/auth-email-response"
import { apiOriginSetting, apiUrl, isFrontendApiTarget } from "@/lib/tuition-api"

const requestHeaders = [
  "authorization",
  "content-type",
  "cookie",
  "origin",
  "referer",
  "sec-fetch-dest",
  "sec-fetch-mode",
  "sec-fetch-site",
]

function unavailable(message = "The TutorLagbe API is unavailable. Make sure Express is running and reachable.") {
  return Response.json(
    { code: "AUTH_UNAVAILABLE", message },
    { status: 503, headers: { "Cache-Control": "no-store" } }
  )
}

async function handleAuth(request: Request) {
  const incoming = new URL(request.url)
  if (!incoming.pathname.startsWith("/api/auth/")) return unavailable()
  const path = incoming.pathname.replace(/\/+$/, "")
  const isToken = path === "/api/auth/token"
  const emailAction = request.method === "POST"
    ? path === "/api/auth/sign-in/email" ? "sign-in" : path === "/api/auth/sign-up/email" ? "sign-up" : undefined
    : undefined
  function authUnavailable(reason: string) {
    console.warn("[Auth] Request failed.", {
      action: emailAction ?? "other",
      status: 503,
      code: "AUTH_UNAVAILABLE",
      reason,
    })
    return unavailable("The authentication service is temporarily unavailable. Try again shortly.")
  }

  const apiOrigin = apiOriginSetting()
  if (!apiOrigin) {
    if (isToken) {
      return unavailable("Dashboard access needs the Express API. Start it with Next.js or configure TUTORLAGBE_API_URL.")
    }
    try {
      const { auth } = await import("@/lib/auth")
      const response = await auth.handler(request)
      return emailAction ? await safeEmailAuthResponse(response, emailAction, "legacy") : response
    } catch {
      return authUnavailable("legacy_handler_failed")
    }
  }

  const target = apiUrl(incoming.pathname)
  if (!target) {
    return authUnavailable("invalid_api_origin")
  }
  if (isFrontendApiTarget(target, incoming)) {
    return authUnavailable("api_origin_is_frontend")
  }
  target.search = incoming.search

  const headers = new Headers()

  for (const name of requestHeaders) {
    const value = request.headers.get(name)

    if (value !== null) {
      headers.set(name, value)
    }
  }

  try {
    const options: RequestInit & { duplex?: "half" } = {
      method: request.method,
      headers,
      body: request.body,
      duplex: request.body ? "half" : undefined,
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(10_000)]),
    }
    const upstream = await fetch(target, options)
    if (upstream.status === 503 && isToken) {
      await upstream.body?.cancel()
      return unavailable("Express authentication is unavailable. Check its auth settings and MongoDB connection.")
    }
    const responseHeaders = new Headers({ "Cache-Control": "no-store" })
    for (const name of ["content-type", "location", "retry-after", "www-authenticate"]) {
      const value = upstream.headers.get(name)
      if (value !== null) responseHeaders.set(name, value)
    }
    for (const cookie of upstream.headers.getSetCookie()) {
      responseHeaders.append("Set-Cookie", cookie)
    }

    const response = new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    })
    return emailAction ? await safeEmailAuthResponse(response, emailAction, "express") : response
  } catch {
    return authUnavailable("upstream_request_failed")
  }
}

export { handleAuth as GET, handleAuth as POST }

