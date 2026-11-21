import { ArrowLeft, Check, CreditCard } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { StripeCheckout } from "@/components/stripe-checkout"
import { paidPlans } from "@/lib/paid-plans"
import { apiUrl } from "@/lib/tuition-api"

import { MockCheckout } from "./mock-checkout"

export const metadata: Metadata = { title: "Payment | Tutor Lagbe" }

async function readCheckoutConfig() {
  const url = apiUrl("/api/payments/config")
  if (!url) return null

  try {
    const response = await fetch(url, {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(1500),
    })
    if (!response.ok) return null
    const config = await response.json()
    return { stripeTestCheckout: config?.stripeTestCheckout === true, mockCheckout: config?.mockCheckout === true }
  } catch {
    return null
  }
}

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string | string[] }>
}) {
  const { plan } = await searchParams
  if (plan !== "plus" && plan !== "pro") redirect("/pricing")
  const selected = paidPlans[plan]
  const development = process.env.NODE_ENV !== "production"
  const config = development ? await readCheckoutConfig() : null
  const useMock = config?.mockCheckout === true &&
    (plan === "plus" || process.env.TUTORLAGBE_CHECKOUT_MODE === "mock" || !config.stripeTestCheckout)

  return (
    <main className="border-t bg-linear-to-b from-indigo-50/70 to-background px-5 py-12 dark:from-indigo-950/35 sm:py-20">
      <div className="mx-auto max-w-xl">
        <Link href="/pricing" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to pricing
        </Link>

        <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">Review your payment</h1>

        <section aria-labelledby="payment-plan" className="mt-6 rounded-3xl border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
          <h2 id="payment-plan" className="text-xl font-semibold">Tutor Lagbe {selected.name}</h2>
          <p className="mt-2 text-muted-foreground">{selected.description}</p>
          <ul className="mt-5 space-y-2 text-sm">
            {selected.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-indigo-700 dark:text-indigo-300" />
                {feature}
              </li>
            ))}
          </ul>

          <dl className="mt-6 flex flex-wrap items-start justify-between gap-2 border-t pt-5">
            <dt className="font-medium">Plan price</dt>
            <dd>
              <span className="block text-2xl font-bold">{selected.price}</span>
              <span className="text-sm text-muted-foreground">{selected.priceDetail}</span>
            </dd>
          </dl>

          {useMock ? (
            <MockCheckout key={plan} plan={plan} />
          ) : plan === "pro" && (!development || config?.stripeTestCheckout) ? (
            <StripeCheckout />
          ) : (
            <>
              <Button type="button" disabled aria-describedby="checkout-status" className="mt-6 h-11 w-full bg-indigo-700 text-white">
                <CreditCard aria-hidden="true" />
                Pay
              </Button>
              <p id="checkout-status" className="mt-3 text-center text-sm text-muted-foreground">
                {plan === "plus" ? "Plus checkout is unavailable." : "Checkout is unavailable."}
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  )
}
