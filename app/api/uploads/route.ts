import { proxyApi } from "@/lib/api-proxy"

export function POST(request: Request) {
  return proxyApi(request, "/api/uploads", 25000)
}
