export function tuitionApiUrl(path = "") {
  const origin = URL.parse(process.env.TUTORLAGBE_API_URL?.trim() ?? "")
  if (
    !origin || !["http:", "https:"].includes(origin.protocol) ||
    origin.pathname !== "/" || origin.username || origin.password ||
    origin.search || origin.hash
  ) return null

  return new URL(`/api/tuitions${path}`, origin)
}

export async function readTuitions(path = "") {
  const url = tuitionApiUrl(path)
  if (!url) return null
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
