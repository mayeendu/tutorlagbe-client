import Image from "next/image"
import Link from "next/link"

import { tuitionFee, type Tuition } from "@/lib/tuition-types"

export function TuitionCard({ tuition }: { tuition: Tuition }) {
  return (
    <li className="flex min-w-0 flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm wrap-anywhere sm:p-6">
      <div className="relative aspect-2/1 overflow-hidden rounded-xl bg-muted">
        <Image
          src={tuition.bannerImage || "/tutoring-hero.webp"}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          unoptimized={Boolean(tuition.bannerImage)}
          className="object-cover"
        />
      </div>
      <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
        {tuition.subject} · {tuition.classLevel}
      </p>
      <h2 className="text-xl font-semibold tracking-tight">{tuition.title}</h2>
      <p className="text-sm text-muted-foreground">{tuition.tutorName} · {tuition.mode}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <p className="font-semibold">
          {tuitionFee.format(tuition.monthlyFee)} <span className="text-sm font-normal text-muted-foreground">/ month</span>
        </p>
        <Link className="rounded-sm text-sm font-semibold text-indigo-700 hover:underline dark:text-indigo-300" href={`/tuitions/${tuition.id}`}>
          View details<span className="sr-only"> for {tuition.title}</span>
        </Link>
      </div>
    </li>
  )
}
