import { tuitionApiUrl } from "@/lib/tuition-api"

async function forward(request: Request) {
  const incoming = new URL(request.url)
  const path = incoming.pathname.replace(/^\/api\/tuitions/, "")
  const root = path === "" || path === "/"
  const list = request.method === "GET" && path === "/moderation"
  const create = request.method === "POST" && root
  const moderate = request.method === "PATCH" && /^\/[\da-f]{24}\/moderation$/i.test(path)
  if (!list && !create && !moderate) {
    return Response.json({ error: "Route not found." }, { status: 404 })
  }

  const target = tuitionApiUrl(path)
  if (target) {
    target.search = incoming.search
    const headers = new Headers()
    for (const key of ["authorization", "content-type"]) {
      const value = request.headers.get(key)
      if (value !== null) headers.set(key, value)
    }
    try {
      const options: RequestInit & { duplex?: "half" } = {
        method: request.method,
        headers,
        body: request.body,
        duplex: request.body ? "half" : undefined,
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.any([request.signal, AbortSignal.timeout(7000)]),
      }
      const response = await fetch(target, options)
      const responseHeaders = new Headers({ "Cache-Control": "no-store" })
      for (const key of ["content-type", "www-authenticate"]) {
        const value = response.headers.get(key)
        if (value !== null) responseHeaders.set(key, value)
      }
      return new Response(response.body, { status: response.status, headers: responseHeaders })
    } catch {
      // Respond consistently when the API is unreachable.
    }
  }

  return Response.json({ error: "The tuition service is temporarily unavailable." }, {
    status: 503, headers: { "Cache-Control": "no-store" },
  })
}

export { forward as GET, forward as POST, forward as PATCH }
