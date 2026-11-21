import { cache } from "react"

import { allCourses, type Course } from "@/lib/course-seeds"
import { resourceSeeds, type Resource } from "@/lib/resource-seeds"
import { apiUrl } from "@/lib/tuition-api"

type Changes<T> = Record<string, { deleted?: boolean; fields?: Partial<T> }>

const readChanges = cache(async () => {
  const url = apiUrl("/api/catalog")
  if (!url) return {}
  const response = await fetch(url, {
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(7000),
  })
  if (response.status === 404) return {}
  if (!response.ok) throw new Error("The catalog is temporarily unavailable.")
  return await response.json()
})

function applyChanges<T extends { slug: string }>(
  seeds: readonly T[], kind: string, changes: Changes<T>
) {
  return seeds.flatMap((entry) => {
    const change = changes[kind + "/" + entry.slug]
    return change?.deleted ? [] : [{ ...entry, ...change?.fields }]
  })
}

export async function readCourses() {
  return applyChanges<Course>(allCourses, "courses", await readChanges())
}

export async function readResources() {
  return applyChanges<Resource>(resourceSeeds, "resources", await readChanges())
}
