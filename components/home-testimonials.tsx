import { Quote } from "lucide-react"
import Image from "next/image"

const stories = [
  {
    quote:
      "I used to skip the hardest physics questions. Working through one problem at a time with a tutor helped me see where I was getting stuck and how to start the next one on my own.",
    role: "HSC student",
    context: "One-on-one physics tuition",
    avatar: "/testimonials/student.webp",
  },
  {
    quote:
      "We needed lessons that fit around school and evening activities. An online session made it easier to keep a regular study routine.",
    role: "Parent",
    context: "Online mathematics tuition",
    avatar: "/testimonials/parent.webp",
  },
  {
    quote:
      "In a small group, I can give students time to explain their reasoning. That tells me much more than a correct answer alone.",
    role: "Tutor",
    context: "Small-group logic tuition",
    avatar: "/testimonials/tutor.webp",
  },
]

export function HomeTestimonials() {
  return (
    <section
      aria-labelledby="testimonials-title"
      className="border-t bg-indigo-50/50 dark:bg-indigo-950/20"
    >
      <div className="mx-auto max-w-360 px-5 py-14 sm:px-8 sm:py-20 lg:px-12 xl:px-16">
        <h2
          id="testimonials-title"
          className="text-3xl font-bold tracking-tight sm:text-4xl"
        >
          What better tutoring can look like
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Illustrative stories from a student, a parent, and a tutor.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-2 lg:gap-5">
          {stories.map(({ quote, role, context, avatar }, index) => {
            const featured = index === 0

            return (
              <figure
                key={role}
                className={
                  featured
                    ? "relative isolate flex flex-col overflow-hidden rounded-3xl bg-linear-to-br from-indigo-800 to-indigo-950 p-6 text-white sm:p-9 lg:row-span-2 lg:p-10"
                    : "flex flex-col rounded-3xl border bg-card p-6 text-card-foreground shadow-sm sm:p-8"
                }
              >
                {featured && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-20 -right-20 -z-10 size-72 rounded-full border border-white/15 bg-white/5"
                  />
                )}
                <Quote
                  aria-hidden="true"
                  className={
                    featured
                      ? "size-10 text-amber-300"
                      : "size-6 text-indigo-600 dark:text-indigo-300"
                  }
                />
                <blockquote
                  className={
                    featured
                      ? "mt-5 mb-8 text-xl leading-relaxed font-medium text-pretty sm:text-2xl lg:text-3xl"
                      : "mt-3 mb-6 text-base leading-relaxed text-pretty sm:text-lg"
                  }
                >
                  <p>{quote}</p>
                </blockquote>
                <figcaption
                  className={`mt-auto flex items-center gap-3 border-t pt-4 ${featured ? "border-white/20" : "border-border"}`}
                >
                  <Image
                    src={avatar}
                    alt=""
                    width={48}
                    height={48}
                    className={`size-12 shrink-0 rounded-full object-cover ring-1 ${featured ? "ring-white/25" : "ring-border"}`}
                  />
                  <div>
                    <p className="font-semibold">{role}</p>
                    <p
                      className={`text-sm ${featured ? "text-indigo-100" : "text-muted-foreground"}`}
                    >
                      {context}
                    </p>
                  </div>
                </figcaption>
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
