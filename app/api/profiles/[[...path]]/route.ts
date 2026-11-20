import { proxyApi } from "@/lib/api-proxy"

async function forward(request: Request) {
  const path = new URL(request.url).pathname
  const list = request.method === "GET" && /^\/api\/profiles\/?$/.test(path)
  if (!list && !/^\/api\/profiles\/[\w-]{1,128}$/.test(path)) {
    return Response.json({ error: "Route not found." }, { status: 404 })
  }
  return proxyApi(request, path)
}

export { forward as GET, forward as PATCH, forward as DELETE }
