import { proxyApi } from "@/lib/api-proxy"

function forward(request: Request) {
  const path = new URL(request.url).pathname
  const action = request.method === "POST" && /^\/api\/payments\/(create-checkout-session|checkout|portal|mock-checkout)$/.test(path)
  const lookup = request.method === "GET" && /^\/api\/payments\/(config|history|transactions|status\/cs_\w{1,200})$/.test(path)
  if (!action && !lookup) return Response.json({ error: "Route not found." }, { status: 404 })
  return proxyApi(request, path, 30_000)
}

export { forward as GET, forward as POST }
