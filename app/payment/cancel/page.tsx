import Link from "next/link"

export default async function PaymentCancelPage({ searchParams }: PageProps<"/payment/cancel">) {
  const { plan } = await searchParams
  return (
    <main className="mx-auto max-w-2xl px-5 py-14 sm:px-8">
      <section className="space-y-4 rounded-3xl border bg-card p-6 sm:p-8">
        <h1 className="text-3xl font-bold">Checkout cancelled</h1>
        <p>Return to pricing whenever you’re ready to continue.</p>
        {(plan === "plus" || plan === "pro") && <Link href={`/payment?plan=${plan}`} className="block font-semibold underline">Resume checkout</Link>}
        <Link href="/pricing" className="inline-block font-semibold underline">Back to pricing</Link>
        <Link href="/payment/history" className="block font-semibold underline">Payment history</Link>
      </section>
    </main>
  )
}
