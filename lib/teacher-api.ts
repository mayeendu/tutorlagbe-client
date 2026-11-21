import { apiUrl } from "@/lib/tuition-api"

export type Teacher = { id: string; name: string; image?: string | null; bio?: string }
export type TeacherPage = { items: Teacher[]; hasMore: boolean }

export async function readTeacherDirectory(path = "") {
  const origin = apiUrl("/api/teachers")
  if (!origin) return null
  const url = new URL("/api/teachers" + path, origin)

  try {
    return await fetch(url, {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(7000),
    })
  } catch {
    return null
  }
}
