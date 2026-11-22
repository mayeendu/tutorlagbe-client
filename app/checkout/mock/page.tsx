import { notFound } from "next/navigation"
import { DemoCheckout } from "./demo-checkout"

export default async function MockCheckoutPage({ searchParams }: {
  searchParams: Promise<{ session?: string | string[] }>
}) {
  if (process.env.NODE_ENV !== "development") notFound()
  const { session } = await searchParams
  if (typeof session !== "string" || !/^mock_[\da-f-]{36}$/.test(session)) notFound()
  return <DemoCheckout session={session} />
}
