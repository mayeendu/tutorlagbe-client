import { ArrowLeft, Check, CreditCard } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { StripeCheckout } from "@/components/stripe-checkout"
import { paidPlans } from "@/lib/paid-plans"
import { apiUrl, isFrontendApiTarget } from "@/lib/tuition-api"

import { MockCheckout } from "./mock-checkout"

export const metadata: Metadata = { title: "Payment | Tutor Lagbe" }

async function readCheckoutConfig() {
  const url = apiUrl("/api/payments/config")
  if (!url || isFrontendApiTarget(url)) {
    console.warn("[Payments] Cannot read checkout configuration.", {
      reason: url ? "api_origin_is_frontend" : "invalid_api_origin",
    })
    return null
  }

  try {
    const response = await fetch(url, {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) {
      console.warn("[Payments] Checkout configuration request failed.", { status: response.status })
      return null
    }
    const config = await response.json()
    if (typeof config?.stripeTestCheckout !== "boolean") {
      console.warn("[Payments] Checkout configuration response is invalid.")
      return null
    }
    return {
      stripeTestCheckout: config.stripeTestCheckout,
      // Older Express releases only support Pro.
      stripeCheckoutPlans: Array.isArray(config.stripeCheckoutPlans) ? config.stripeCheckoutPlans : ["pro"],
      mockCheckout: config.mockCheckout === true,
    }
  } catch (error) {
    console.warn("[Payments] Cannot read checkout configuration.", {
      reason: error instanceof Error && error.name === "TimeoutError" ? "timeout" : "unreadable_response",
    })
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
  const config = await readCheckoutConfig()
  const useStripe = config?.stripeTestCheckout === true && config.stripeCheckoutPlans.includes(plan)
  const useMock = process.env.NODE_ENV === "development" && config?.mockCheckout === true
  const unavailable = !config
    ? "Could not connect to the checkout service."
    : !config.stripeTestCheckout
      ? "Stripe Test Mode is not configured on the checkout service."
      : `${selected.name} requires a newer version of the checkout service.`

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

          {useStripe ? (
            <StripeCheckout key={plan} plan={plan} />
          ) : useMock ? (
            <MockCheckout key={plan} plan={plan} />
          ) : (
            <>
              <Button type="button" disabled aria-describedby="checkout-status" className="mt-6 h-11 w-full bg-indigo-700 text-white">
                <CreditCard aria-hidden="true" />
                Pay
              </Button>
              <p id="checkout-status" role="status" className="mt-3 text-center text-sm text-muted-foreground">
                {unavailable} <a href={`/payment?plan=${plan}`} className="font-semibold underline">Try again</a>
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  )
}
