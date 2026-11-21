import { proxyApi } from "@/lib/api-proxy"

export function POST(request: Request) {
  return proxyApi(request, "/api/payments/create-checkout-session", 30_000)
}
