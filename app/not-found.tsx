import { PageFallback } from "@/components/page-fallback"

export default function NotFound() {
  return (
    <PageFallback
      title="404 · Page not found"
      message="The page you requested may have moved or been removed."
    />
  )
}
