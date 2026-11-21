import { proxyApi } from "@/lib/api-proxy"

async function forward(request: Request) {
  const incoming = new URL(request.url)
  const path = incoming.pathname.replace(/^\/api\/tuitions/, "")
  const root = path === "" || path === "/"
  const list = request.method === "GET" && path === "/moderation"
  const create = request.method === "POST" && root
  const moderate = request.method === "PATCH" && /^\/[\da-f]{24}\/moderation$/i.test(path)
  const managedList = request.method === "GET" && path === "/manage"
  const managedDetails = ["GET", "PATCH", "DELETE"].includes(request.method) && /^\/manage\/[\da-f]{24}$/i.test(path)
  const savedList = request.method === "GET" && path === "/saved"
  const savedDetails = ["GET", "PUT", "DELETE"].includes(request.method) && /^\/saved\/[\da-f]{24}$/i.test(path)
  if (!list && !create && !moderate && !managedList && !managedDetails && !savedList && !savedDetails) {
    return Response.json({ error: "Route not found." }, { status: 404 })
  }

  return proxyApi(request, `/api/tuitions${path}`)
}

export { forward as GET, forward as POST, forward as PATCH, forward as PUT, forward as DELETE }
