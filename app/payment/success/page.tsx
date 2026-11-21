import { StripePaymentStatus } from "@/components/stripe-payment-status"

export default async function PaymentSuccessPage({ searchParams }: PageProps<"/payment/success">) {
  const { session_id: id } = await searchParams
  const sessionId = typeof id === "string" && /^cs_\w{1,200}$/.test(id) ? id : undefined
  return (
    <main className="mx-auto max-w-2xl px-5 py-14 sm:px-8">
      <section className="space-y-4 rounded-3xl border bg-card p-6 sm:p-8">
        <h1 className="text-3xl font-bold">Payment status</h1>
        <StripePaymentStatus sessionId={sessionId} />
      </section>
    </main>
  )
}
