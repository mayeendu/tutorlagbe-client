import { proxyApi } from "@/lib/api-proxy"

type Context = RouteContext<"/api/catalog/[kind]/[slug]">

async function mutate(request: Request, { params }: Context) {
  const { kind, slug } = await params
  if (!["courses", "resources"].includes(kind) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return Response.json({ error: "Catalog entry not found." }, { status: 404 })
  }
  return proxyApi(request, "/api/catalog/" + kind + "/" + slug)
}

export const PATCH = mutate
export const DELETE = mutate
