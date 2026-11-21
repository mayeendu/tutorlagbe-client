"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { ToastFeedback } from "@/components/toast-feedback"
import { useManagedResource } from "@/hooks/use-managed-resource"
import { useSession } from "@/lib/auth-client"

export function StripePaymentStatus({ sessionId }: { sessionId?: string }) {
  const { data: session, isPending, error: sessionError, refetch } = useSession()
  const path = session?.user && sessionId ? `/api/payments/status/${sessionId}` : null
  const { data, error, reload } = useManagedResource<{ status: "pending" | "active" | "expired" | "failed" }>(path, 5000)

  if (!sessionId) return <p role="alert"><ToastFeedback message="Missing Stripe checkout session." />This page needs a Stripe checkout session to show your status.</p>
  if (isPending) return <p role="status">Checking your session…</p>
  if (sessionError) return <p role="alert"><ToastFeedback message="Could not check your session." />Could not check your session. Refresh to try again.</p>
  if (!session?.user) return <p><Link className="font-semibold underline" href="/sign-in">Sign in</Link> to check your plan on your profile.</p>
  if (error) return <p role="alert">{error.message} <Button variant="outline" onClick={reload}>Retry</Button></p>
  if (data?.status === "active") return (
    <div className="space-y-4"><p role="status">Your payment was confirmed and Pro is active.</p>
      <ToastFeedback message="Payment confirmed. Pro is active." success />
      <Link href="/dashboard/profile" className="font-semibold underline" onClick={() => { void refetch() }}>View your plan</Link>
      <Link href="/payment/history" className="block font-semibold underline">Payment history</Link>
    </div>
  )
  if (data?.status === "expired") return <p><ToastFeedback message="Checkout expired." />Checkout expired. <Link className="font-semibold underline" href="/pricing">Return to pricing</Link> to start again.</p>
  if (data?.status === "failed") return <p><ToastFeedback message="Payment failed." />Payment failed. <Link className="font-semibold underline" href="/payment?plan=pro">Try checkout again</Link>.</p>
  return <p role="status">Waiting for Stripe to confirm your payment. This page updates automatically.</p>
}
