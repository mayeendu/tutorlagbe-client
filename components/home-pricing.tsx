import { Check, GraduationCap, Layers3, Sparkles } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

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
  {
    name: "Plus",
    description: "Organize your search as you compare tuition options.",
    price: "Coming soon",
    priceDetail: "Pricing to be announced",
    icon: Layers3,
    features: [
      "Everything in Free",
      "Save a shortlist of tuition options",
      "Get alerts for new listings in your subjects",
    ],
  },
  {
    name: "Pro",
    description: "Get priority booking or grow your tutoring practice.",
    price: "$10 / $15",
    priceDetail: "USD · Student / Tutor",
    icon: Sparkles,
    features: [
      "Everything in Free",
      "Priority booking for students",
      "Unlimited tuition listings for tutors",
    ],
  },
]

export function HomePricing() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="border-t bg-linear-to-b from-indigo-50/70 to-background dark:from-indigo-950/35"
    >
      <div className="mx-auto max-w-360 px-5 py-14 sm:px-8 sm:py-20 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="pricing-title"
            className="text-3xl font-bold tracking-tight sm:text-5xl"
          >
            Find your Tutor Lagbe plan
          </h2>
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
              const isPro = name === "Pro"
              return (
                <article
                  key={name}
                  className={
                    isPro
                      ? "flex h-full flex-col rounded-3xl border border-indigo-500 bg-linear-to-br from-indigo-800 to-indigo-950 p-6 text-white shadow-lg shadow-indigo-950/15 sm:p-8"
                      : "flex h-full flex-col rounded-3xl border bg-card p-6 text-card-foreground shadow-sm sm:p-8"
                  }
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid size-11 shrink-0 place-items-center rounded-xl ${isPro ? "bg-white/15 text-indigo-100" : "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"}`}
                    >
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <h3 className="text-2xl font-semibold tracking-tight">
                      {name}
                    </h3>
                  </div>
                  <p
                    className={`mt-4 lg:min-h-12 ${isPro ? "text-indigo-100" : "text-muted-foreground"}`}
                  >
                    {description}
                  </p>
                  <div
                    className={`mt-6 border-b pb-6 ${isPro ? "border-white/20" : "border-border"}`}
                  >
                    <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                      {price}
                    </p>
                    <p
                      className={`mt-1 text-sm ${isPro ? "text-indigo-100" : "text-muted-foreground"}`}
                    >
                      {priceDetail}
                    </p>
                  </div>
                  <ul className="mt-6 mb-8 space-y-3 text-sm sm:text-base">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check
                          aria-hidden="true"
                          className={`mt-0.5 size-4 shrink-0 ${isPro ? "text-amber-300" : "text-indigo-700 dark:text-indigo-300"}`}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {name === "Free" ? (
                    <Button
                      nativeButton={false}
                      render={<Link href="/sign-up" />}
                      className="mt-auto h-11 w-full bg-indigo-700 text-white hover:bg-indigo-800"
                    >
                      Create a free account
                    </Button>
                  ) : (
                    <p
                      className={`mt-auto flex min-h-11 items-center justify-center rounded-lg px-3 text-center text-sm font-medium ${isPro ? "bg-white/10 text-indigo-50" : "bg-muted text-muted-foreground"}`}
                    >
                      {isPro ? "Checkout coming soon" : "Planned features"}
                    </p>
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
