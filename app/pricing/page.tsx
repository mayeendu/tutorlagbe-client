import type { Metadata } from "next"

import { PlanCards } from "@/app/pricing/plan-cards"

export const metadata: Metadata = { title: "Pricing | Tutor Lagbe" }

export default function PricingPage() {
  return (
    <main>
      <PlanCards />
    </main>
  )
}
