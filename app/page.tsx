import Image from "next/image"
import Link from "next/link"

import { HomeCourseSections } from "@/components/course-catalog"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <main>
      <section aria-labelledby="home-hero-title" className="overflow-hidden">
        <div className="mx-auto grid max-w-360 items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-14 lg:px-12 lg:py-24 xl:px-16">
          <div>
            <h1
              id="home-hero-title"
              className="text-5xl leading-[1.04] font-bold tracking-tight text-balance sm:text-6xl xl:text-7xl"
            >
              Find the right{" "}
              <span className="text-indigo-700 dark:text-indigo-300">tutor</span>{" "}
              for you.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Find one-on-one lessons and small-group tuition in the subjects
              you need, online or near you.
            </p>
            <Button
              nativeButton={false}
              render={<Link href="/tuitions" />}
              className="mt-8 h-12 bg-indigo-700 px-6 text-base text-white hover:bg-indigo-800"
            >
              Browse tuitions
            </Button>
            <p className="mt-5 text-sm text-muted-foreground sm:text-base">
              Want to teach?{" "}
              <Link
                href="/sign-up"
                className="rounded-sm font-semibold text-indigo-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring dark:text-indigo-300"
              >
                Sign up as a tutor
              </Link>
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-140 px-3 pt-4 pb-5 sm:px-7 sm:pt-5 sm:pb-7">
            <div
              aria-hidden="true"
              className="absolute inset-x-3 inset-y-5 -rotate-4 rounded-3xl bg-indigo-100 sm:inset-x-5 dark:bg-indigo-950"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-3 inset-y-5 rotate-4 rounded-3xl bg-amber-100 sm:inset-x-5 dark:bg-amber-950"
            />
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-muted shadow-xl ring-1 ring-black/5 dark:ring-white/10">
              <Image
                src="/tutoring-hero.webp"
                alt="A tutor and student working through a problem together at a study table"
                fill
                preload
                sizes="(min-width: 1200px) 504px, (min-width: 1024px) 43vw, (min-width: 640px) 504px, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      <HomeCourseSections />
    </main>
  )
}
