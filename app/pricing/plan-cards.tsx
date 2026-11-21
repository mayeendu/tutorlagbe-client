import { Check, GraduationCap, Layers3, Sparkles } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { paidPlans } from "@/lib/paid-plans"

const plans = [
  {
    name: "Free",
    description: "Find a tutor or start offering tuition.",
    price: "$0",
    priceDetail: "Free to join",
    icon: GraduationCap,
    features: [
      "Browse online and in-person tuition",
      "Apply for lessons as a student",
      "Publish up to two listings as a tutor",
    ],
  },
  { ...paidPlans.plus, icon: Layers3 },
  { ...paidPlans.pro, icon: Sparkles },
]

export function PlanCards() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="border-t bg-linear-to-b from-indigo-50/70 to-background dark:from-indigo-950/35"
    >
      <div className="mx-auto max-w-360 px-5 py-14 sm:px-8 sm:py-20 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1
            id="pricing-title"
            className="text-3xl font-bold tracking-tight sm:text-5xl"
          >
            Find your Tutor Lagbe plan
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Start free as a student or tutor, and explore plans for when you
            need more.
          </p>
        </div>

        <div className="mt-9 grid gap-5 lg:grid-cols-3">
          {plans.map(
            ({
              name,
              description,
              price,
              priceDetail,
              icon: Icon,
              features,
            }) => {
              const isHighlighted = name === "Plus"
              return (
                <article
                  key={name}
                  className={
                    isHighlighted
                      ? "flex h-full flex-col rounded-3xl border border-indigo-500 bg-linear-to-br from-indigo-800 to-indigo-950 p-6 text-white shadow-lg shadow-indigo-950/15 sm:p-8"
                      : "flex h-full flex-col rounded-3xl border bg-card p-6 text-card-foreground shadow-sm sm:p-8"
                  }
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid size-11 shrink-0 place-items-center rounded-xl ${isHighlighted ? "bg-white/15 text-indigo-100" : "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"}`}
                    >
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <h2 className="text-2xl font-semibold tracking-tight">
                      {name}
                    </h2>
                  </div>
                  <p
                    className={`mt-4 lg:min-h-12 ${isHighlighted ? "text-indigo-100" : "text-muted-foreground"}`}
                  >
                    {description}
                  </p>
                  <div
                    className={`mt-6 border-b pb-6 ${isHighlighted ? "border-white/20" : "border-border"}`}
                  >
                    <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                      {price}
                    </p>
                    <p
                      className={`mt-1 text-sm ${isHighlighted ? "text-indigo-100" : "text-muted-foreground"}`}
                    >
                      {priceDetail}
                    </p>
                  </div>
                  <ul className="mt-6 mb-8 space-y-3 text-sm sm:text-base">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check
                          aria-hidden="true"
                          className={`mt-0.5 size-4 shrink-0 ${isHighlighted ? "text-amber-300" : "text-indigo-700 dark:text-indigo-300"}`}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {name === "Free" ? (
                    <Button
                      nativeButton={false}
                      render={<Link href="/tuitions" />}
                      className="mt-auto h-11 w-full bg-indigo-700 text-white hover:bg-indigo-800"
                    >
                      Browse tuitions
                    </Button>
                  ) : (
                    <Button
                      nativeButton={false}
                      render={<Link href={isHighlighted ? "/payment?plan=plus" : "/payment?plan=pro"} />}
                      className={`mt-auto h-11 w-full ${isHighlighted ? "bg-white text-indigo-950 hover:bg-indigo-100" : "bg-indigo-700 text-white hover:bg-indigo-800"}`}
                    >
                      Choose {name}
                    </Button>
                  )}
                </article>
              )
            }
          )}
        </div>
      </div>
    </section>
  )
}
