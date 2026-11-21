import { LoadingSkeleton } from "@/components/loading-skeleton"

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8">
      <LoadingSkeleton label="Loading page…" variant="cards" showHeading />
    </main>
  )
}
