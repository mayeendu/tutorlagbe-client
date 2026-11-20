import type { Metadata } from "next"

import { allCourses, CourseGrid } from "@/components/course-catalog"

export const metadata: Metadata = { title: "All courses | Tutor Lagbe" }

export default function CoursesPage() {
  return (
    <main className="mx-auto max-w-360 px-5 py-12 sm:px-8 sm:py-16 lg:px-12 xl:px-16">
      <h1 className="mb-8 text-4xl font-bold tracking-tight">All courses</h1>
      <CourseGrid courses={allCourses} />
    </main>
  )
}
