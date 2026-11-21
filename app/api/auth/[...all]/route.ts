const requestHeaders = [
  "authorization",
  "content-type",
  "cookie",
  "origin",
  "referer",
  "sec-fetch-mode",
  "sec-fetch-site",
]

function unavailable(message = "The TutorLagbe API is unavailable. Make sure Express is running and reachable.") {
  return Response.json(
    { message },
    { status: 503, headers: { "Cache-Control": "no-store" } }
  )
}

async function handleAuth(request: Request) {
  const incoming = new URL(request.url)
  if (!incoming.pathname.startsWith("/api/auth/")) return unavailable()
  const isToken = incoming.pathname.replace(/\/+$/, "") === "/api/auth/token"
  const apiOrigin = process.env.TUTORLAGBE_API_URL?.trim()
  if (!apiOrigin) {
    if (isToken) {
      return unavailable("Dashboard access needs the Express API. Start it with Next.js or configure TUTORLAGBE_API_URL.")
    }
    try {
      const { auth } = await import("@/lib/auth")
      return await auth.handler(request)
    } catch {
      return unavailable("Authentication is temporarily unavailable.")
    }
  }

  const target = apiUrl(incoming.pathname)
  if (!target) return unavailable("TUTORLAGBE_API_URL must be the Express server origin.")
  target.search = incoming.search

  const headers = new Headers()
  for (const name of requestHeaders) {
    const value = request.headers.get(name)
    if (value !== null) headers.set(name, value)
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

    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    })
  } catch {
    return unavailable()
  }
}

export { handleAuth as GET, handleAuth as POST }

import { apiUrl } from "@/lib/tuition-api"

