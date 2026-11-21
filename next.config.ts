import { existsSync } from "node:fs"
import { resolve } from "node:path"
import type { NextConfig } from "next"
import { PHASE_DEVELOPMENT_SERVER } from "next/constants"

export default function nextConfig(phase: string): NextConfig {
  if (
    phase === PHASE_DEVELOPMENT_SERVER &&
    process.env.TUTORLAGBE_API_URL === undefined &&
    existsSync(resolve(process.cwd(), "../tutorlagbe-server/api/start.ts"))
  ) {
    process.env.TUTORLAGBE_API_URL = "http://127.0.0.1:8000"
  }

  return {}
}
