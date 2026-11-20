const requestHeaders = [
  "authorization",
  "content-type",
  "cookie",
  "origin",
  "referer",
  "sec-fetch-mode",
  "sec-fetch-site",
]

function unavailable() {
  return Response.json(
    { message: "Authentication is temporarily unavailable" },
    { status: 503, headers: { "Cache-Control": "no-store" } }
  )
}

async function handleAuth(request: Request) {
  const apiOrigin = process.env.TUTORLAGBE_API_URL?.trim()
  if (!apiOrigin) {
    try {
      const { auth } = await import("@/lib/auth")
      return await auth.handler(request)
    } catch {
      return unavailable()
    }
  }

  const target = URL.parse(apiOrigin)
  if (
    !target ||
    !["http:", "https:"].includes(target.protocol) ||
    target.pathname !== "/" ||
    target.username ||
    target.password ||
    target.search ||
    target.hash
  ) {
    return unavailable()
  }

  const incoming = new URL(request.url)
  if (!incoming.pathname.startsWith("/api/auth/")) return unavailable()
  target.pathname = incoming.pathname
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

