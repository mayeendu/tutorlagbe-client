import {
  Atom,
  BarChart3,
  Binary,
  Calculator,
  Code2,
  FlaskConical,
  Globe,
  Languages,
  Network,
  Timer,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

type Course = {
  topic: string
  title: string
  duration: string
  level: "Beginner" | "Intermediate"
  icon: LucideIcon
  color: string
}

const recommended: Course[] = [
  {
    topic: "React",
    title: "Build interactive websites with React",
    duration: "4 hours",
    level: "Beginner",
    icon: Atom,
    color: "from-cyan-800 to-sky-600",
  },
  {
    topic: "GraphQL",
    title: "Query and update data with GraphQL",
    duration: "3 hours",
    level: "Intermediate",
    icon: Network,
    color: "from-fuchsia-900 to-pink-600",
  },
  {
    topic: "Angular",
    title: "Build your first Angular application",
    duration: "2 hours",
    level: "Beginner",
    icon: Code2,
    color: "from-rose-900 to-red-600",
  },
  {
    topic: "Python",
    title: "Python programming fundamentals",
    duration: "3 hours",
    level: "Beginner",
    icon: Binary,
    color: "from-blue-950 to-blue-600",
  },
]

const popular: Course[] = [
  {
    topic: "Mathematics",
    title: "Algebra essentials for secondary school",
    duration: "5 hours",
    level: "Beginner",
    icon: Calculator,
    color: "from-indigo-950 to-indigo-600",
  },
  {
    topic: "English",
    title: "English for everyday conversations",
    duration: "4 hours",
    level: "Beginner",
    icon: Languages,
    color: "from-teal-900 to-emerald-700",
  },
  {
    topic: "Chemistry",
    title: "Chemical reactions and balancing equations",
    duration: "3 hours",
    level: "Intermediate",
    icon: FlaskConical,
    color: "from-violet-950 to-purple-600",
  },
  {
    topic: "Web development",
    title: "Design responsive pages with HTML and CSS",
    duration: "4 hours",
    level: "Beginner",
    icon: Globe,
    color: "from-orange-950 to-orange-700",
  },
]

export function CourseGrid({
  courses,
  heading: Heading = "h2",
}: {
  courses: readonly Course[]
  heading?: "h2" | "h3"
}) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {courses.map(({ topic, title, duration, level, icon: Icon, color }) => (
        <li
          key={topic}
          className="overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm"
        >
          <article>
            <div
              className={`relative isolate flex aspect-video flex-col items-center justify-center gap-3 overflow-hidden bg-linear-to-br px-4 text-center text-white ${color}`}
            >
              <span
                aria-hidden="true"
                className="absolute -top-14 -right-9 -z-10 size-44 rounded-full border border-white/25 bg-white/10"
              />
              <span
                aria-hidden="true"
                className="absolute -bottom-8 -left-3 -z-10 size-28 rotate-24 rounded-3xl border border-white/25 bg-white/10"
              />
              <div className="grid size-14 place-items-center rounded-2xl border border-white/30 bg-white/15">
                <Icon aria-hidden="true" className="size-8" />
              </div>
              <p className="text-xl font-semibold tracking-tight">{topic}</p>
            </div>
            <div className="px-5 py-5">
              <Heading className="min-h-12 leading-6 font-semibold">
                {title}
              </Heading>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t pt-4 text-sm text-muted-foreground">
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
      ))}
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

export function HomeCourseSections() {
  return collections.map(({ id, title, courses }) => (
    <section key={id} aria-labelledby={id} className="border-t odd:bg-muted/45">
      <div className="mx-auto max-w-360 px-5 py-12 sm:px-8 sm:py-16 lg:px-12 xl:px-16">
        <h2
          id={id}
          className="mb-7 text-3xl font-bold tracking-tight sm:text-4xl"
        >
          {title}
        </h2>
        <CourseGrid courses={courses} heading="h3" />
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

export const allCourses = [...recommended, ...popular]
