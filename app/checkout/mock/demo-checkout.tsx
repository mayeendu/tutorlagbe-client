"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { useManagedResource } from "@/hooks/use-managed-resource"
import { useSession } from "@/lib/auth-client"
import { authorizedRequest } from "@/lib/managed-api"
import { notifyError } from "@/lib/notify"

type Outcome = "paid" | "failed" | "cancelled"
type Action = "pay" | "fail" | "cancel"
type DemoSession = {
  plan: "plus" | "pro"
  amount: number
  currency: "usd"
  status: "pending" | "expired" | Outcome
  entitlementExpiresAt?: string
}
const messages = {
  paid: "Demo payment successful",
  failed: "Demo payment failed",
  cancelled: "Demo payment cancelled",
  expired: "Demo checkout expired",
}

export function DemoCheckout({ session }: { session: string }) {
  const router = useRouter()
  const result = usePathname().endsWith("/result")
  const { data: auth, isPending, error: sessionError } = useSession()
  const endpoint = "/api/payments/mock-checkout/" + session
  const { data, error, reload } = useManagedResource<DemoSession>(auth?.user ? endpoint : null)
  const inFlight = useRef(false)
  const [busy, setBusy] = useState(false)

  async function finish(action: Action) {
    if (inFlight.current) return
    inFlight.current = true
    setBusy(true)
    try {
      const response = await authorizedRequest(endpoint, "POST", { action })
      const { status }: DemoSession = await response.json()
      if (status === "paid") toast.success(messages.paid, { toasterId: "tuition" })
      else if (status === "failed" || status === "cancelled") toast.info(messages[status], { toasterId: "tuition" })
      reload()
      router.replace("/checkout/mock/result?session=" + session)
    } catch (error) {
      notifyError(error, "Could not complete demo checkout.")
      reload()
    } finally {
      inFlight.current = false
      setBusy(false)
    }
  }

  return (
    <main className="mx-auto my-12 max-w-lg space-y-5 rounded-2xl border bg-card p-5 sm:p-8">
      <p className="inline-block rounded-md bg-muted px-3 py-1 text-sm font-semibold">Demo Mode</p>
      <h1 className="text-2xl font-bold">DEMO PAYMENT - NO REAL CHARGE</h1>
      <p>No real money will be charged.</p>
      {isPending ? <LoadingSkeleton label="Checking your session…" />
        : sessionError ? <p role="alert">Could not check your session. Refresh to try again.</p>
          : !auth?.user ? <Link href="/sign-in" className="underline">Sign in to continue</Link>
            : error ? <p role="alert">{error.message} <Button variant="outline" onClick={reload}>Retry</Button></p>
              : !data ? <LoadingSkeleton label="Loading demo checkout…" />
                : (
                  <section className="space-y-4 border-t pt-4">
                    <p className="text-lg font-semibold"><span className="capitalize">{data.plan}</span> · {new Intl.NumberFormat("en-US", {
                      style: "currency", currency: data.currency,
                    }).format(data.amount / 100)}</p>
                    {data.status !== "pending" ? (
                      <div role="status" className="space-y-2">
                        <h2 className="font-semibold">{messages[data.status]}</h2>
                        {data.entitlementExpiresAt && <p>Demo access expires {new Date(data.entitlementExpiresAt).toLocaleDateString()}.</p>}
                      </div>
                    ) : result ? <Link className="underline" href={"/checkout/mock?session=" + session}>Return to Checkout</Link> : (
                      <div className="flex flex-wrap gap-2">
                        <Button disabled={busy} onClick={() => void finish("pay")}>{busy ? "Processing…" : "Pay Now"}</Button>
                        <Button disabled={busy} variant="outline" onClick={() => void finish("cancel")}>Cancel</Button>
                        <Button disabled={busy} variant="outline" onClick={() => void finish("fail")}>Simulate Failure</Button>
                      </div>
                    )}
                  </section>
                )}
      <nav className="flex flex-wrap gap-4 text-sm underline">
        <Link href="/payment/history">Payment history</Link>
        <Link href="/pricing">Back to pricing</Link>
      </nav>
    </main>
  )
}
