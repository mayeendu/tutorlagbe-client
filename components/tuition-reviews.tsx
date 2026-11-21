import { Star } from "lucide-react"
import Link from "next/link"

import type { TuitionReviewPage } from "@/lib/application-types"

const date = new Intl.DateTimeFormat("en-BD", { dateStyle: "medium", timeZone: "Asia/Dhaka" })

export function TuitionReviews({ tuitionId, reviews, page }: {
  tuitionId: string
  reviews: TuitionReviewPage | null
  page: number
}) {
  function pageHref(number: number) {
    return `/tuitions/${tuitionId}${number > 1 ? `?reviewPage=${number}` : ""}#tuition-reviews`
  }

  return (
    <section id="tuition-reviews" aria-labelledby="tuition-reviews-title" className="mt-7 space-y-4 border-t pt-6">
      <h2 id="tuition-reviews-title" className="text-xl font-semibold">Student reviews</h2>
      {!reviews ? (
        <p className="text-sm text-muted-foreground">Reviews are temporarily unavailable.</p>
      ) : reviews.items.length ? (
        <ul className="grid gap-3">
          {reviews.items.map(({ rating, feedback, createdAt }, index) => (
            <li key={`${createdAt}-${index}`} className="space-y-2 rounded-xl border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="inline-flex items-center gap-1.5 text-sm font-semibold">
                  <Star aria-hidden="true" className="size-4 fill-current text-amber-600 dark:text-amber-400" />
                  {rating} out of 5 stars
                </p>
                <time dateTime={createdAt} className="text-xs text-muted-foreground">{date.format(new Date(createdAt))}</time>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-anywhere">{feedback}</p>
            </li>
          ))}
        </ul>
      ) : <p className="text-sm text-muted-foreground">{page === 1 ? "No reviews yet." : "There are no reviews on this page."}</p>}
      {reviews && (page > 1 || reviews.hasMore) && (
        <nav aria-label="Review pages" className="flex flex-wrap gap-4 text-sm font-semibold">
          {page > 1 && <Link href={pageHref(page - 1)} className="underline">Previous reviews</Link>}
          {reviews.hasMore && <Link href={pageHref(page + 1)} className="underline">Next reviews</Link>}
        </nav>
      )}
    </section>
  )
}
