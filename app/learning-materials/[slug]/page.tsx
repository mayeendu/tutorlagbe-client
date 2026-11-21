import { ChevronLeft } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { CatalogAdminActions } from "@/components/catalog-admin-actions"
import { courseCover } from "@/components/course-catalog"
import { readResources } from "@/lib/catalog"

type ResourcePageProps = { params: Promise<{ slug: string }> }

async function getResource(slug: string) {
  const resource = (await readResources()).find((entry) => entry.slug === slug)
  if (!resource) notFound()
  return resource
}

export async function generateMetadata({ params }: ResourcePageProps): Promise<Metadata> {
  const resource = await getResource((await params).slug)
  return { title: resource.title + " | Tutor Lagbe", description: resource.summary }
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const resource = await getResource((await params).slug)
  const cover = resource.imageUrl ?? courseCover(resource.cover)
  return (
    <main className="mx-auto w-full max-w-4xl px-5 pt-8 pb-16 sm:px-8">
      <Link href="/learning-materials" className="inline-flex items-center gap-1 rounded-sm text-sm font-medium text-indigo-700 hover:underline focus-visible:outline-2 focus-visible:outline-ring dark:text-indigo-300">
        <ChevronLeft aria-hidden="true" className="size-4" />
        All learning materials
      </Link>
      <CatalogAdminActions key={resource.slug} kind="resources" entry={resource} currentImage={cover} />
      <article className="mt-6 overflow-hidden rounded-3xl border bg-card shadow-sm">
        <div className="relative aspect-2/1 bg-muted">
          <Image src={cover} unoptimized={Boolean(resource.imageUrl)} alt="" fill preload sizes="(min-width: 896px) 832px, 94vw" className="object-cover" />
        </div>
        <div className="space-y-5 p-6 sm:p-10">
          <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
            {resource.subject} · {resource.level} · {resource.kind}
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{resource.title}</h1>
          <p className="text-lg text-muted-foreground">{resource.summary}</p>
          <p className="leading-relaxed whitespace-pre-line">{resource.lesson}</p>
          <section className="space-y-3 rounded-xl bg-muted p-4">
            <h2 className="font-semibold">Try it</h2>
            <p className="whitespace-pre-line">{resource.practice}</p>
            <details>
              <summary className="cursor-pointer rounded-sm text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring">Show answer</summary>
              <p className="mt-2 whitespace-pre-line">{resource.answer}</p>
            </details>
          </section>
        </div>
      </article>
    </main>
  )
}
