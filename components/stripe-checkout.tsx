"use client"

import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { ToastFeedback } from "@/components/toast-feedback"
import { notifyError } from "@/lib/notify"
import { useManagedResource } from "@/hooks/use-managed-resource"
import { useSession } from "@/lib/auth-client"
import { authorizedRequest } from "@/lib/managed-api"

export function StripeCheckout() {
  const { data, isPending, error } = useSession()
  const [pending, setPending] = useState(false)
  const [failure, setFailure] = useState("")
  const user = data?.user
  const pro = user?.plan === "pro"
  const { data: billing, error: billingError, reload } = useManagedResource<{ canManageSubscription: boolean }>(
    pro ? "/api/payments/history" : null,
  )

  async function openBilling() {
    if (pending) return
    setPending(true)
    setFailure("")
    try {
      const response = await authorizedRequest(`/api/payments/${pro ? "portal" : "create-checkout-session"}`, "POST")
      const { url } = await response.json()
      const redirect = typeof url === "string" ? URL.parse(url) : null
      const host = pro ? "billing.stripe.com" : "checkout.stripe.com"
      if (!redirect || redirect.origin !== `https://${host}` || redirect.username || redirect.password) {
        throw new Error("Invalid Stripe redirect. Try again.")
      }
      window.location.assign(redirect.href)
    } catch (failure) {
      setFailure(notifyError(failure, "Could not open Stripe. Try again."))
      setPending(false)
    }
  }

  if (isPending) return <p role="status" className="mt-4 text-sm">Checking your session…</p>
  if (error) return <p role="alert" className="mt-4 text-sm"><ToastFeedback message="Could not check your session." />Could not check your session. Refresh to try again.</p>
  if (!user) return <Link className="mt-4 inline-block font-semibold underline" href="/sign-in">Sign in to upgrade</Link>
  if (user.role !== "student" && user.role !== "tutor") return <p className="mt-4 text-sm">Pro is available to students and teachers.</p>

  return (
    <div className="mt-4 space-y-2">
      <p className="text-sm">{pro ? "You are on Pro." : "Stripe test mode. Use a test card to make a one-time payment."}</p>
      {pro && !billing && !billingError && <p role="status" className="text-sm">Checking billing options…</p>}
      {billingError && <p role="alert" className="text-sm">{billingError.message} <Button variant="outline" onClick={reload}>Retry</Button></p>}
      {(!pro || billing?.canManageSubscription) && (
        <Button disabled={pending} className="min-h-11 bg-indigo-700 text-white hover:bg-indigo-800" onClick={() => void openBilling()}>
          {pending ? "Opening Stripe…" : pro ? "Manage subscription" : `Pay $${user.role === "student" ? 10 : 15} with Stripe`}
        </Button>
      )}
      <Link href="/payment/history" className="block w-fit text-sm font-semibold underline">Payment history</Link>
      {failure && <p role="alert" className="text-sm text-destructive">{failure}</p>}
    </div>
  )
}
