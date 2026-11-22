import { apiUrl, isFrontendApiTarget } from "@/lib/tuition-api"

export async function proxyApi(request: Request, path: string, timeout = 7000) {
  const target = apiUrl(path)
  const incoming = new URL(request.url)
  const paymentRoute = path.startsWith("/api/payments/")
    ? path.replace(/^\/api\/payments\/status\/.+$/, "/api/payments/status/:id")
    : undefined
  const selfTarget = target && isFrontendApiTarget(target, incoming)
  let failure = selfTarget ? "api_origin_is_frontend" : "invalid_api_origin"
  if (target && !selfTarget) {
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
        signal: AbortSignal.any([request.signal, AbortSignal.timeout(timeout)]),
      }
      const response = await fetch(target, options)
      if (paymentRoute && !response.ok) {
        console.warn("[Payments] Upstream response.", { route: paymentRoute, status: response.status })
      }
      const responseHeaders = new Headers({ "Cache-Control": "no-store" })
      for (const key of ["content-type", "www-authenticate"]) {
        const value = response.headers.get(key)
        if (value !== null) responseHeaders.set(key, value)
      }
      return new Response(response.body, { status: response.status, headers: responseHeaders })
    } catch {
      failure = "upstream_request_failed"
    }
  }
  if (paymentRoute) {
    console.warn("[Payments] Proxy request failed.", { route: paymentRoute, status: 503, reason: failure })
  }
  return Response.json({ error: "The service is temporarily unavailable." }, {
    status: 503, headers: { "Cache-Control": "no-store" },
  })
}
