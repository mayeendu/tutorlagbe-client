import type { Metadata } from "next"
import Link from "next/link"

import { CourseGrid } from "@/components/course-catalog"
import { TuitionCard } from "@/components/tuition-card"
import { readCourses } from "@/lib/catalog"
import { courseClass, courseMode } from "@/lib/course-seeds"
import { Button } from "@/components/ui/button"
import { readTuitions } from "@/lib/tuition-api"
import type { TuitionPage } from "@/lib/tuition-types"

export const metadata: Metadata = { title: "All courses | Tutor Lagbe" }

const selectClass = "h-11 rounded-lg border bg-background px-3 text-sm"

export default async function CoursesPage({
  searchParams,
}: PageProps<"/courses">) {
  const query = await searchParams
  const mode = courseMode.safeParse(query.mode).data
  const classLevel = courseClass.safeParse(query.class).data
  const pageValue = typeof query.page === "string" ? Number(query.page) : 1
  const page = Number.isInteger(pageValue) && pageValue >= 1 && pageValue <= 1000 ? pageValue : 1
  const filters = new URLSearchParams()
  if (mode) filters.set("mode", mode === "Physical" ? "Offline" : mode)
  if (classLevel) filters.set("classLevel", classLevel)
  filters.set("page", String(page))

  const [catalog, response] = await Promise.all([readCourses(), readTuitions(`?${filters}`)])
  const tutorCourses: TuitionPage | null = response?.ok ? await response.json().catch(() => null) : null
  const courses = catalog.filter(
    (course) =>
      (!mode || course.mode === mode) &&
      (!classLevel || course.classLevel === classLevel)
  )

  function pageHref(number: number) {
    const params = new URLSearchParams()
    if (mode) params.set("mode", mode)
    if (classLevel) params.set("class", classLevel)
    if (number > 1) params.set("page", String(number))
    return params.size ? `/courses?${params}` : "/courses"
  }

  return (
    <main className="mx-auto max-w-360 px-5 py-12 sm:px-8 sm:py-16 lg:px-12 xl:px-16">
      <h1 className="mb-8 text-4xl font-bold tracking-tight">All courses</h1>
      <form
        action="/courses"
        method="get"
        aria-label="Filter courses"
        className="mb-6 grid gap-3 rounded-2xl border bg-card p-4 sm:flex sm:items-end"
      >
        <label className="grid gap-1.5 text-sm font-medium">
          Mode
          <select
            key={mode ?? ""}
            name="mode"
            defaultValue={mode ?? ""}
            className={selectClass}
          >
            <option value="">All modes</option>
            {courseMode.options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Class level
          <select
            key={classLevel ?? ""}
            name="class"
            defaultValue={classLevel ?? ""}
            className={selectClass}
          >
            <option value="">All classes</option>
            {courseClass.options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <Button
          type="submit"
          className="h-11 bg-indigo-700 px-5 text-white hover:bg-indigo-800"
        >
          Apply filters
        </Button>
        {(mode || classLevel) && (
          <Button
            nativeButton={false}
            render={<Link href="/courses" />}
            variant="ghost"
            className="h-11 px-4"
          >
            Clear filters
          </Button>
        )}
      </form>
      <section aria-labelledby="tutor-courses" className="mb-10">
        <h2 id="tutor-courses" className="mb-4 text-2xl font-bold">Tutor courses</h2>
        {!tutorCourses ? (
          <p className="rounded-2xl border bg-card p-6 text-muted-foreground">
            Tutor courses are temporarily unavailable.
          </p>
        ) : tutorCourses.items.length ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tutorCourses.items.map((tuition) => <TuitionCard key={tuition.id} tuition={tuition} />)}
          </ul>
        ) : (
          <p className="rounded-2xl border border-dashed p-6 text-muted-foreground">
            No tutor courses match these filters.
          </p>
        )}
        {tutorCourses && (page > 1 || tutorCourses.hasMore) && (
          <nav aria-label="Tutor course pages" className="mt-6 flex flex-wrap gap-4 text-sm font-medium">
            {page > 1 && <Link href={pageHref(page - 1)} className="underline">Previous page</Link>}
            {tutorCourses.hasMore && <Link href={pageHref(page + 1)} className="underline">Next page</Link>}
          </nav>
        )}
      </section>
      <h2 className="mb-4 text-2xl font-bold">Course catalog</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        {courses.length} {courses.length === 1 ? "course" : "courses"}
      </p>
      {courses.length ? (
        <CourseGrid courses={courses} />
      ) : (
        <p className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
          No courses match these filters.
        </p>
      )}
    </main>
  )
}
