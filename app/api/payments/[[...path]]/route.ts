import { proxyApi } from "@/lib/api-proxy"

function forward(request: Request) {
  const path = new URL(request.url).pathname
  if (/^\/api\/payments\/mock-checkout(?:\/|$)/.test(path) &&
      process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Route not found." }, { status: 404 })
  }
  const mockSession = /^\/api\/payments\/mock-checkout\/mock_[\da-f-]{36}$/.test(path)
  const action = request.method === "POST" && (mockSession || /^\/api\/payments\/(create-checkout-session|checkout|portal|mock-checkout)$/.test(path))
  const lookup = request.method === "GET" && (mockSession || /^\/api\/payments\/(config|history|transactions|status\/cs_\w{1,200}|mock-checkout\/subscription)$/.test(path))
  if (!action && !lookup) return Response.json({ error: "Route not found." }, { status: 404 })
  return proxyApi(request, path, 30_000)
}

export { forward as GET, forward as POST }
