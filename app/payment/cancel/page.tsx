import Link from "next/link"

export default function PaymentCancelPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-14 sm:px-8">
      <section className="space-y-4 rounded-3xl border bg-card p-6 sm:p-8">
        <h1 className="text-3xl font-bold">Checkout cancelled</h1>
        <p>Return to pricing whenever you’re ready to continue.</p>
        <Link href="/pricing" className="inline-block font-semibold underline">Back to pricing</Link>
      </section>
    </main>
  )
}
