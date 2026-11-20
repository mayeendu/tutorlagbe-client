import Link from "next/link"
import { notFound } from "next/navigation"

import { PublicTuitionActions } from "@/components/managed-tuitions"
import { readTuitions } from "@/lib/tuition-api"
import { tuitionFee, type Tuition } from "@/lib/tuition-types"

export default async function TuitionDetails({ params }: PageProps<"/tuitions/[id]">) {
  const { id } = await params
  if (!/^[\da-f]{24}$/i.test(id)) notFound()
  const response = await readTuitions(`/${id}`)
  if (response?.status === 404) notFound()
  const tuition: Tuition | null = response?.ok ? await response.json().catch(() => null) : null

  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <Link href="/tuitions" className="text-sm font-semibold text-indigo-700 hover:underline dark:text-indigo-300">Back to tuitions</Link>
      {tuition ? (
        <article className="mt-6 rounded-3xl border bg-card p-6 sm:p-10">
          <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">{tuition.subject} · {tuition.classLevel}</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight [overflow-wrap:anywhere]">{tuition.title}</h1>
          <dl className="my-6 grid gap-4 border-y py-5 sm:grid-cols-2">
            <div><dt className="text-sm text-muted-foreground">Tutor</dt><dd>{tuition.tutorName}</dd></div>
            <div><dt className="text-sm text-muted-foreground">Format</dt><dd>{tuition.mode}{tuition.location && ` · ${tuition.location}`}</dd></div>
            <div><dt className="text-sm text-muted-foreground">Schedule</dt><dd>{tuition.daysPerWeek} {tuition.daysPerWeek === 1 ? "day" : "days"} per week</dd></div>
            <div><dt className="text-sm text-muted-foreground">Monthly fee</dt><dd>{tuitionFee.format(tuition.monthlyFee)}</dd></div>
          </dl>
          <h2 className="text-xl font-semibold">About this tuition</h2>
          <p className="mt-3 whitespace-pre-wrap leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">{tuition.description}</p>
          <PublicTuitionActions id={tuition.id} />
        </article>
      ) : <h1 className="mt-6 text-2xl font-semibold">Tuition details are temporarily unavailable.</h1>}
    </main>
  )
}
