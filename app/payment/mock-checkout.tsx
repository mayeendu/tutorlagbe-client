"use client"

import { CircleX, CreditCard } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"
import { notifyError } from "@/lib/notify"
import { authorizedRequest } from "@/lib/managed-api"

export function MockCheckout({ plan }: { plan: "plus" | "pro" }) {
  const [cancelled, setCancelled] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [failure, setFailure] = useState("")
  const { data, isPending, error, refetch } = useSession()
  const router = useRouter()
  const role = data?.user?.role

  async function pay() {
    if (submitting) return
    setSubmitting(true)
    setFailure("")
    try {
      await authorizedRequest("/api/payments/mock-checkout", "POST", { plan })
    } catch (error) {
      setFailure(notifyError(error, "Could not complete mock checkout."))
      setSubmitting(false)
      return
    }
    toast.success("Payment successful", { toasterId: "tuition" })
    await refetch().catch(() => undefined)
    router.replace("/dashboard")
  }

  return (
    <section aria-labelledby="mock-checkout-heading" className="mt-6 rounded-2xl border bg-muted/40 p-4 sm:p-5">
      <h3 id="mock-checkout-heading" className="flex items-center gap-2 font-semibold">
        <CreditCard aria-hidden="true" className="size-5" />
        Test card payment
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Mock checkout upgrades your account for local testing without making a charge.
      </p>

      <div role="status" aria-atomic="true">
        {cancelled && (
          <div className="mt-4 space-y-1 rounded-xl border bg-background p-4">
            <p className="flex items-center gap-2 font-semibold">
              <CircleX aria-hidden="true" className="size-5" />
              Mock payment cancelled
            </p>
            <p className="text-sm text-muted-foreground">No money was charged.</p>
          </div>
        )}
      </div>

      {cancelled ? (
        <Button type="button" variant="outline" className="mt-4" onClick={() => setCancelled(false)}>
          Return to Checkout
        </Button>
      ) : (
        <>
          <dl className="mt-4 grid grid-cols-2 gap-3">
            <div className="col-span-2 rounded-lg border bg-background px-3 py-2">
              <dt className="text-xs text-muted-foreground">Card number</dt>
              <dd className="font-mono text-sm">4242 4242 4242 4242</dd>
            </div>
            <div className="rounded-lg border bg-background px-3 py-2">
              <dt className="text-xs text-muted-foreground">Expiry date</dt>
              <dd className="font-mono text-sm">12/99</dd>
            </div>
            <div className="rounded-lg border bg-background px-3 py-2">
              <dt className="text-xs text-muted-foreground">CVC</dt>
              <dd className="font-mono text-sm">123</dd>
            </div>
          </dl>
          {isPending ? <p role="status" className="mt-4 text-sm">Checking your session…</p>
            : error ? <p role="alert" className="mt-4 text-sm">Could not check your session. Refresh to try again.</p>
              : !data?.user ? <Link href="/sign-in" className="mt-4 inline-block text-sm font-semibold underline">Sign in to upgrade</Link>
                : role !== "student" && role !== "tutor" ? <p className="mt-4 text-sm">Checkout is available to students and tutors.</p>
                  : (
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <Button type="button" disabled={submitting} className="min-h-11 bg-indigo-700 text-white hover:bg-indigo-800" onClick={() => void pay()}>
                        {submitting ? "Processing…" : "Stripe Payment"}
                      </Button>
                      <Button type="button" disabled={submitting} variant="outline" className="min-h-11" onClick={() => { setFailure(""); setCancelled(true); toast.info("Checkout cancelled.", { toasterId: "tuition" }) }}>
                        Cancel Stripe Payment
                      </Button>
                    </div>
                  )}
          {failure && <p role="alert" className="mt-3 text-sm text-destructive">{failure}</p>}
        </>
      )}
    </section>
  )
}
