"use client"

import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"
import { authorizedRequest } from "@/lib/managed-api"

export function StripeCheckout() {
  const { data, isPending, error } = useSession()
  const [pending, setPending] = useState(false)
  const [failure, setFailure] = useState("")
  const user = data?.user
  const pro = user?.plan === "pro"

  async function openBilling() {
    if (pending) return
    setPending(true)
    setFailure("")
    try {
      const response = await authorizedRequest(`/api/payments/${pro ? "portal" : "checkout"}`, "POST")
      const { url } = await response.json()
      const redirect = typeof url === "string" ? URL.parse(url) : null
      const host = pro ? "billing.stripe.com" : "checkout.stripe.com"
      if (!redirect || redirect.origin !== `https://${host}` || redirect.username || redirect.password) {
        throw new Error("Invalid Stripe redirect. Try again.")
      }
      window.location.assign(redirect.href)
    } catch (failure) {
      setFailure(failure instanceof Error ? failure.message : "Could not open Stripe. Try again.")
      setPending(false)
    }
  }

  if (isPending) return <p role="status" className="mt-4 text-sm">Checking your session…</p>
  if (error) return <p role="alert" className="mt-4 text-sm">Could not check your session. Refresh to try again.</p>
  if (!user) return <Link className="mt-4 inline-block font-semibold underline" href="/sign-in">Sign in to upgrade</Link>
  if (user.role !== "student" && user.role !== "tutor") return <p className="mt-4 text-sm">Pro is available to students and teachers.</p>

  return (
    <div className="mt-4 space-y-2">
      {pro && <p className="text-sm">You are on Pro.</p>}
      <Button disabled={pending} className="min-h-11 bg-indigo-700 text-white hover:bg-indigo-800" onClick={() => void openBilling()}>
        {pending ? "Opening Stripe…" : pro ? "Manage subscription" : `Subscribe with Stripe · $${user.role === "student" ? 10 : 15}/month`}
      </Button>
      {failure && <p role="alert" className="text-sm text-destructive">{failure}</p>}
    </div>
  )
}
