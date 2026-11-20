import type { Metadata } from "next"
import Link from "next/link"

import {
  allCourses,
  courseClass,
  CourseGrid,
  courseMode,
} from "@/components/course-catalog"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = { title: "All courses | Tutor Lagbe" }

const selectClass = "h-11 rounded-lg border bg-background px-3 text-sm"

export default async function CoursesPage({
  searchParams,
}: PageProps<"/courses">) {
  const query = await searchParams
  const mode = courseMode.safeParse(query.mode).data
  const classLevel = courseClass.safeParse(query.class).data
  const courses = allCourses.filter(
    (course) =>
      (!mode || course.mode === mode) &&
      (!classLevel || course.classLevel === classLevel)
  )

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
