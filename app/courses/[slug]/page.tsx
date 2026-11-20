import { Check, ChevronLeft, ShoppingBag } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { allCourses, courseCover } from "@/components/course-catalog"
import { Button } from "@/components/ui/button"

type CoursePageProps = { params: Promise<{ slug: string }> }

const formatFee = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
})

function getCourse(slug: string) {
  const course = allCourses.find((course) => course.slug === slug)
  if (!course) notFound()
  return course
}

export function generateStaticParams() {
  return allCourses.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const course = getCourse((await params).slug)
  return {
    title: `${course.title} | Tutor Lagbe`,
    description: course.description,
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const course = getCourse((await params).slug)
  const facts = [
    ["Class level", course.classLevel],
    ["Difficulty", course.level],
    ["Duration", course.duration],
    ["Format", course.mode === "Physical" ? "In person" : course.mode],
  ]

  return (
    <main className="bg-linear-to-b from-indigo-50 via-background to-background dark:from-indigo-950/35">
      <div className="mx-auto max-w-7xl px-5 pt-8 pb-16 sm:px-8 lg:px-12 lg:pb-24">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1 rounded-sm text-sm font-medium text-indigo-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring dark:text-indigo-300"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
          All courses
        </Link>

        <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
          <div className="contents lg:block">
            <header className="rounded-3xl border border-indigo-200/70 bg-card p-6 shadow-sm sm:p-10 dark:border-indigo-900/70">
              <div className="relative mb-7 aspect-3/2 overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={courseCover(course.slug)}
                  alt=""
                  fill
                  preload
                  sizes="(min-width: 1280px) 700px, (min-width: 1024px) 55vw, 90vw"
                  className="object-cover"
                />
              </div>
              <p className="mb-3 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                {course.topic}
              </p>
              <h1 className="max-w-2xl text-4xl leading-tight font-bold tracking-tight text-balance sm:text-5xl">
                {course.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {course.description}
              </p>
            </header>

            <section
              aria-labelledby="course-outcomes"
              className="order-2 lg:mt-10"
            >
              <h2
                id="course-outcomes"
                className="text-2xl font-bold tracking-tight sm:text-3xl"
              >
                What you’ll learn
              </h2>
              <ul className="mt-5 divide-y rounded-2xl border bg-card">
                {course.outcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className="flex items-center gap-3 px-5 py-4"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">
                      <Check aria-hidden="true" className="size-4" />
                    </span>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside
            aria-label="Course fee and details"
            className="self-start rounded-3xl border bg-card p-6 shadow-sm lg:sticky lg:top-6"
          >
            <p className="text-sm font-medium text-muted-foreground">
              Course fee
            </p>
            <p className="mt-2 text-4xl font-bold tracking-tight">
              {formatFee.format(course.fee)}
            </p>
            <Button
              disabled
              aria-describedby="checkout-status"
              className="mt-5 h-12 w-full gap-2 bg-indigo-700 text-base text-white disabled:bg-indigo-700/65 disabled:opacity-100 dark:disabled:bg-indigo-700/70"
            >
              <ShoppingBag aria-hidden="true" className="size-5" />
              Buy course
            </Button>
            <p
              id="checkout-status"
              className="mt-2 text-center text-sm text-muted-foreground"
            >
              Checkout coming soon
            </p>

            <dl className="mt-6 divide-y border-t text-sm">
              {facts.map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-4 py-3 last:pb-0"
                >
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="text-right font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </div>
    </main>
  )
}
