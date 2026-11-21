import { ArrowRight, BookOpen } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { readResources } from "@/lib/catalog"

import { courseCover } from "@/components/course-catalog"

export const metadata: Metadata = {
  title: "Learning Materials | Tutor Lagbe",
  description:
    "Browse free study notes, worked examples, and practice questions by subject.",
}

export default async function LearningMaterialsPage() {
  const materials = await readResources()
  return (
    <main>
      <header className="border-b border-indigo-200/60 bg-indigo-50 dark:border-indigo-900/70 dark:bg-indigo-950/40">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 sm:px-8 sm:py-16 md:grid-cols-[minmax(0,1fr)_auto] lg:px-12">
          <div className="max-w-xl">
            <BookOpen
              aria-hidden="true"
              className="mb-4 size-8 text-indigo-700 dark:text-indigo-300"
            />
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Learning Materials
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Review key ideas with study notes, work through examples, and test
              your understanding with practice questions.
            </p>
          </div>
          <div className="relative hidden aspect-3/2 w-64 overflow-hidden rounded-2xl border border-indigo-200 bg-card shadow-sm md:block lg:w-80 dark:border-indigo-900">
            <Image
              src="/tutoring-hero.webp"
              alt=""
              fill
              sizes="(min-width: 1024px) 320px, 256px"
              className="object-cover"
            />
          </div>
        </div>
      </header>

      <section
        aria-labelledby="materials-heading"
        className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12"
      >
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <h2
            id="materials-heading"
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            Study library
          </h2>
          <p className="text-sm text-muted-foreground">
            {materials.length} free materials
          </p>
        </div>
        <ul className="grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {materials.map((material) => (
            <li key={material.slug} className="h-full">
              <Link href={`/learning-materials/${material.slug}`} className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition hover:border-indigo-500/50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
                <div className="relative aspect-2/1 bg-muted">
                  <Image
                    src={material.imageUrl ?? courseCover(material.cover)}
                    unoptimized={Boolean(material.imageUrl)}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 380px, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 94vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-sm font-medium">
                    <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-indigo-800 dark:text-indigo-200">
                      {material.subject}
                    </span>
                    <span className="text-muted-foreground">
                      {material.level} · {material.kind}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    {material.title}
                  </h3>
                  <p className="mt-2 mb-5 flex-1 leading-relaxed text-muted-foreground">
                    {material.summary}
                  </p>
                  <span className="flex items-center justify-between border-t pt-3 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                    Read material
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
