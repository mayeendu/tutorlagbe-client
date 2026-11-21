import { BarChart3, Timer } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { readCourses } from "@/lib/catalog"
import { popular, recommended, type Course } from "@/lib/course-seeds"

import { Button } from "@/components/ui/button"

export function courseCover(slug: string) {
  return `/courses/${slug}.webp`
}

export function CourseGrid({
  courses,
  heading: Heading = "h2",
}: {
  courses: readonly Course[]
  heading?: "h2" | "h3"
}) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {courses.map(
        ({ slug, topic, title, duration, level, mode, classLevel, imageUrl }) => (
          <li
            key={slug}
            className="rounded-2xl border bg-card text-card-foreground shadow-sm transition focus-within:border-indigo-500/50 hover:border-indigo-500/50 hover:shadow-md"
          >
            <article className="relative flex h-full flex-col p-4">
              <div className="mb-4">
                <div className="relative mb-4 aspect-3/2 overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={imageUrl ?? courseCover(slug)}
                    unoptimized={Boolean(imageUrl)}
                    alt=""
                    fill
                    sizes="(min-width: 1440px) 290px, (min-width: 1024px) 23vw, (min-width: 640px) 46vw, 92vw"
                    className="object-cover"
                  />
                </div>
                <p className="text-sm font-semibold">{topic}</p>
              </div>
              <div className="flex flex-1 flex-col">
                <div className="mb-3 flex flex-wrap gap-2 text-xs font-medium">
                  <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-indigo-800 dark:text-indigo-200">
                    {mode}
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-1">
                    {classLevel}
                  </span>
                </div>
                <Heading className="mb-4 flex-1 leading-6 font-semibold">
                  <Link
                    href={`/courses/${slug}`}
                    className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-indigo-500"
                  >
                    {title}
                  </Link>
                </Heading>
                <div className="flex flex-wrap gap-x-4 gap-y-2 border-t pt-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Timer aria-hidden="true" className="size-4" /> {duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <BarChart3 aria-hidden="true" className="size-4" /> {level}
                  </span>
                </div>
              </div>
            </article>
          </li>
        )
      )}
    </ul>
  )
}

const collections = [
  {
    id: "recommended-courses",
    title: "Recommended course for you",
    courses: recommended,
  },
  { id: "popular-courses", title: "Our popular course", courses: popular },
]

export async function HomeCourseSections() {
  const catalog = await readCourses()
  return collections.map(({ id, title, courses }) => (
    <section key={id} aria-labelledby={id} className="border-t odd:bg-muted/45">
      <div className="mx-auto max-w-360 px-5 py-12 sm:px-8 sm:py-16 lg:px-12 xl:px-16">
        <h2
          id={id}
          className="mb-7 text-3xl font-bold tracking-tight sm:text-4xl"
        >
          {title}
        </h2>
        <CourseGrid courses={catalog.filter((course) => courses.some(({ slug }) => slug === course.slug))} heading="h3" />
        <div className="mt-8 flex justify-center">
          <Button
            nativeButton={false}
            render={<Link href="/courses" />}
            className="h-12 bg-indigo-700 px-6 text-base text-white hover:bg-indigo-800"
          >
            All courses
          </Button>
        </div>
      </div>
    </section>
  ))
}
