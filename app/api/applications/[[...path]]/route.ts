import { proxyApi } from "@/lib/api-proxy"

function forward(request: Request) {
  const path = new URL(request.url).pathname
  const list = request.method === "GET" && /^\/api\/applications\/(mine|received)$/.test(path)
  const apply = request.method === "POST" && /^\/api\/applications\/?$/.test(path)
  const cancel = request.method === "DELETE" && /^\/api\/applications\/[\da-f]{24}$/i.test(path)
  const review = request.method === "PATCH" && /^\/api\/applications\/[\da-f]{24}\/status$/i.test(path)
  const submitReview = request.method === "POST" && /^\/api\/applications\/[\da-f]{24}\/review$/i.test(path)
  if (!list && !apply && !cancel && !review && !submitReview) {
    return Response.json({ error: "Route not found." }, { status: 404 })
  }
  return proxyApi(request, path)
}

export { forward as GET, forward as POST, forward as PATCH, forward as DELETE }
