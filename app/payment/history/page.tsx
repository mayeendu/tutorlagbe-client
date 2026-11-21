"use client"

import Link from "next/link"

import { LoadingSkeleton } from "@/components/loading-skeleton"
import { StripeTransactions } from "@/components/stripe-transactions"
import { ToastFeedback } from "@/components/toast-feedback"
import { useSession } from "@/lib/auth-client"

export default function PaymentHistoryPage() {
  const { data, isPending, error } = useSession()

  return (
    <main className="mx-auto max-w-3xl space-y-5 px-5 py-14 sm:px-8">
      <Link href="/pricing" className="text-sm font-semibold underline">Back to pricing</Link>
      {isPending ? <LoadingSkeleton label="Checking your session…" showHeading />
        : error ? <p role="alert"><ToastFeedback message="Could not check your session." />Could not check your session. Refresh to try again.</p>
          : data?.user ? <StripeTransactions personal />
            : <p><Link href="/sign-in" className="font-semibold underline">Sign in</Link> to view your payment history.</p>}
    </main>
  )
}
