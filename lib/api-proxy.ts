import { apiUrl } from "@/lib/tuition-api"

export async function proxyApi(request: Request, path: string, timeout = 7000) {
  const target = apiUrl(path)
  if (target) {
    target.search = new URL(request.url).search
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
        signal: AbortSignal.any([request.signal, AbortSignal.timeout(timeout)]),
      }
      const response = await fetch(target, options)
      const responseHeaders = new Headers({ "Cache-Control": "no-store" })
      for (const key of ["content-type", "www-authenticate"]) {
        const value = response.headers.get(key)
        if (value !== null) responseHeaders.set(key, value)
      }
      return new Response(response.body, { status: response.status, headers: responseHeaders })
    } catch {
      // Report connection failures without exposing upstream configuration.
    }
  }
  return Response.json({ error: "The service is temporarily unavailable." }, {
    status: 503, headers: { "Cache-Control": "no-store" },
  })
}
