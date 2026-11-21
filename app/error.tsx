"use client"

import { PageFallback } from "@/components/page-fallback"

export default function ErrorPage() {
  return (
    <PageFallback
      title="Something went wrong"
      message="We couldn’t load this page. Go back to the homepage and try again."
    />
  )
}
