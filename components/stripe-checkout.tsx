"use client"

import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { ToastFeedback } from "@/components/toast-feedback"
import { notifyError } from "@/lib/notify"
import { useManagedResource } from "@/hooks/use-managed-resource"
import { useSession } from "@/lib/auth-client"
import { authorizedRequest } from "@/lib/managed-api"
import { paidPlans, type PaidPlan } from "@/lib/paid-plans"

export function StripeCheckout({ plan }: { plan: PaidPlan }) {
  const { data, isPending, error } = useSession()
  const [pending, setPending] = useState(false)
  const [failure, setFailure] = useState("")
  const user = data?.user
  const pro = user?.plan === "pro"
  const alreadyCovered = pro || user?.plan === plan
  const { data: billing, error: billingError, reload } = useManagedResource<{ canManageSubscription: boolean }>(
    pro ? "/api/payments/history" : null,
  )

  async function openBilling(manage: boolean) {
    if (pending) return
    setPending(true)
    setFailure("")
    try {
      const response = await authorizedRequest(
        `/api/payments/${manage ? "portal" : "create-checkout-session"}`, "POST", manage ? undefined : { plan },
      )
      const { url } = await response.json()
      const redirect = typeof url === "string" ? URL.parse(url) : null
      const host = manage ? "billing.stripe.com" : "checkout.stripe.com"
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
  if (user.role !== "student" && user.role !== "tutor") return <p className="mt-4 text-sm">Paid plans are available to students and tutors.</p>
  const price = plan === "pro" && user.role === "tutor" ? "$15" : "$10"

  return (
    <div className="mt-4 space-y-2">
      <p className="text-sm">{alreadyCovered ? `You are on ${pro ? "Pro" : "Plus"}.` : "Stripe test mode. Use a test card to make a one-time payment."}</p>
      {!alreadyCovered && (
        <div className="space-y-1 text-sm">
          <p>Test card <code className="font-semibold">4242 4242 4242 4242</code></p>
          <p>Expiry: Any future date · CVC: Any 3 digits · ZIP: Any valid value</p>
        </div>
      )}
      {pro && !billing && !billingError && <p role="status" className="text-sm">Checking billing options…</p>}
      {billingError && <p role="alert" className="text-sm">{billingError.message} <Button variant="outline" onClick={reload}>Retry</Button></p>}
      {(!alreadyCovered || billing?.canManageSubscription) && (
        <Button disabled={pending} className="min-h-11 bg-indigo-700 text-white hover:bg-indigo-800" onClick={() => void openBilling(alreadyCovered)}>
          {pending ? "Opening Stripe…" : alreadyCovered ? "Manage subscription" : `Pay ${price} for ${paidPlans[plan].name}`}
        </Button>
      )}
      <Link href="/payment/history" className="block w-fit text-sm font-semibold underline">Payment history</Link>
      {failure && <p role="alert" className="text-sm text-destructive">{failure}</p>}
    </div>
  )
}
