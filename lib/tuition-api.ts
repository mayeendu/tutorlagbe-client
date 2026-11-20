export function apiUrl(path: string) {
  const origin = URL.parse(process.env.TUTORLAGBE_API_URL?.trim() ?? "")
  if (
    !origin || !["http:", "https:"].includes(origin.protocol) ||
    origin.pathname !== "/" || origin.username || origin.password ||
    origin.search || origin.hash
  ) return null

  origin.pathname = path
  return origin
}

export async function readTuitions(path = "") {
  const url = apiUrl("/api/tuitions")
  if (!url) return null
  const target = new URL(`/api/tuitions${path}`, url)
  try {
    return await fetch(target, {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(7000),
    })
  } catch {
    return null
  }
}
