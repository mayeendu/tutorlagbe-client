import { BarChart3, Timer } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { z } from "zod"

import { Button } from "@/components/ui/button"

export const courseMode = z.enum(["Online", "Physical"])
export const courseClass = z.enum([
  "HSC",
  "SSC",
  "Honours",
  "Degree",
  "O-level",
])

type Course = {
  slug: string
  topic: string
  title: string
  duration: string
  level: "Beginner" | "Intermediate"
  mode: z.infer<typeof courseMode>
  classLevel: z.infer<typeof courseClass>
  fee: number
  description: string
  outcomes: string[]
}

const recommended: Course[] = [
  {
    topic: "Mathematics",
    slug: "algebra-and-geometry-essentials",
    fee: 1200,
    description:
      "Build a foundation in algebra and geometry through worked examples and practice with SSC-level problems.",
    outcomes: [
      "Simplify algebraic expressions and solve linear equations",
      "Use angle and triangle properties to solve geometry problems",
      "Apply algebra and geometry to multi-step questions",
    ],
    mode: "Online",
    classLevel: "SSC",
    title: "Algebra and geometry essentials",
    duration: "4 hours",
    level: "Beginner",
  },
  {
    topic: "Physics",
    slug: "motion-forces-and-energy",
    fee: 1500,
    description:
      "Connect the equations of mechanics to everyday motion and build confidence solving HSC-level physics problems.",
    outcomes: [
      "Interpret displacement and velocity graphs",
      "Use Newton’s laws and draw free-body diagrams",
      "Solve problems using work and conservation of energy",
    ],
    mode: "Physical",
    classLevel: "HSC",
    title: "Motion, forces, and energy",
    duration: "3 hours",
    level: "Intermediate",
  },
  {
    topic: "Chemistry",
    slug: "chemical-reactions-and-equations",
    fee: 1100,
    description:
      "Learn to represent chemical changes clearly, from identifying reactants and products to balancing equations.",
    outcomes: [
      "Write word and symbol equations for common reactions",
      "Balance equations using conservation of mass",
      "Recognize common reaction types from their equations",
    ],
    mode: "Physical",
    classLevel: "O-level",
    title: "Chemical reactions and equations",
    duration: "2 hours",
    level: "Beginner",
  },
  {
    topic: "Biology",
    slug: "cells-genetics-and-living-systems",
    fee: 1300,
    description:
      "Explore how cells work, how traits are inherited, and how organisms are organized into living systems.",
    outcomes: [
      "Compare the structures of plant and animal cells",
      "Predict simple patterns of inheritance",
      "Explain how cells, tissues, and organs work together",
    ],
    mode: "Online",
    classLevel: "HSC",
    title: "Cells, genetics, and living systems",
    duration: "3 hours",
    level: "Beginner",
  },
]

const popular: Course[] = [
  {
    topic: "ICT",
    slug: "computing-and-digital-communication",
    fee: 1600,
    description:
      "Understand how computers represent information and how networks move it between devices.",
    outcomes: [
      "Identify the roles of common hardware and software",
      "Explain how computers represent data in binary",
      "Describe how devices communicate over a network",
    ],
    mode: "Online",
    classLevel: "HSC",
    title: "Computing and digital communication",
    duration: "5 hours",
    level: "Beginner",
  },
  {
    topic: "History",
    slug: "modern-history-and-social-change",
    fee: 1400,
    description:
      "Use historical evidence to examine how industrialization, political movements, and migration reshaped modern societies.",
    outcomes: [
      "Evaluate primary sources in their historical context",
      "Trace the social effects of industrialization and migration",
      "Build a historical argument using evidence",
    ],
    mode: "Physical",
    classLevel: "Degree",
    title: "Modern history and social change",
    duration: "4 hours",
    level: "Beginner",
  },
  {
    topic: "Sociology",
    slug: "society-culture-and-institutions",
    fee: 1350,
    description:
      "Use sociological concepts to examine how culture, social norms, and institutions shape everyday life.",
    outcomes: [
      "Distinguish norms, values, and social roles",
      "Compare sociological perspectives on institutions",
      "Apply those perspectives to an example of social change",
    ],
    mode: "Online",
    classLevel: "Honours",
    title: "Society, culture, and institutions",
    duration: "3 hours",
    level: "Intermediate",
  },
  {
    topic: "Logic",
    slug: "reasoning-arguments-and-fallacies",
    fee: 1250,
    description:
      "Practice breaking arguments into their parts and evaluating whether their conclusions follow from the evidence.",
    outcomes: [
      "Identify premises and conclusions",
      "Distinguish deductive reasoning from inductive reasoning",
      "Spot common fallacies in everyday arguments",
    ],
    mode: "Physical",
    classLevel: "HSC",
    title: "Reasoning, arguments, and fallacies",
    duration: "4 hours",
    level: "Beginner",
  },
]

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
        ({ slug, topic, title, duration, level, mode, classLevel }) => (
          <li
            key={slug}
            className="rounded-2xl border bg-card text-card-foreground shadow-sm transition focus-within:border-indigo-500/50 hover:border-indigo-500/50 hover:shadow-md"
          >
            <article className="relative flex h-full flex-col p-4">
              <div className="mb-4">
                <div className="relative mb-4 aspect-3/2 overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={courseCover(slug)}
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
