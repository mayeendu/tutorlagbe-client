import type { Metadata } from "next"
import Link from "next/link"

import { StripeCheckout } from "@/components/stripe-checkout"

export const metadata: Metadata = { title: "Pricing | Tutor Lagbe" }

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-8 px-5 py-14 sm:px-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Tutor Lagbe plans</h1>
        <p className="text-muted-foreground">Start free, or upgrade to a monthly Pro membership.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <section className="flex flex-col space-y-4 rounded-3xl border bg-card p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">Free</h2>
          <p className="text-3xl font-bold">$0</p>
          <ul className="flex-1 space-y-2 text-sm text-muted-foreground">
            <li>Students can browse and apply for tuitions.</li>
            <li>Teachers can publish up to two listings.</li>
          </ul>
          <Link href="/tuitions" className="w-fit text-sm font-semibold underline">Browse tuitions</Link>
        </section>
        <section className="space-y-4 rounded-3xl border border-indigo-400/50 bg-indigo-50 p-6 sm:p-8 dark:bg-indigo-950/45">
          <h2 className="text-2xl font-semibold">Pro</h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div><dt className="text-sm text-muted-foreground">Student</dt><dd className="text-2xl font-bold">$10 <span className="text-sm font-normal">USD/month</span></dd></div>
            <div><dt className="text-sm text-muted-foreground">Teacher</dt><dd className="text-2xl font-bold">$15 <span className="text-sm font-normal">USD/month</span></dd></div>
          </dl>
          <p className="text-sm text-muted-foreground">Pro teachers can publish unlimited tuition listings. Your account role determines your price.</p>
          <StripeCheckout />
        </section>
      </div>
    </main>
  )
}
