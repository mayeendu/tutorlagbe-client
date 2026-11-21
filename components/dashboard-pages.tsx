"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { useSession } from "@/lib/auth-client"
import { dashboardHref, dashboardNavigation, dashboardRoles, type DashboardRole } from "@/lib/dashboard-navigation"

export function DashboardOverview({ role }: { role: "student" | "admin" }) {
  const { data } = useSession()
  const dashboardLinks = role === "student"
    ? ["apply-courses", "my-courses", "my-applications"]
    : ["tuitions", "users", "transactions"]
  const name = data?.user.name.trim().split(/\s+/)[0]

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="rounded-2xl border bg-linear-to-br from-indigo-50 to-card p-6 sm:p-8 dark:from-indigo-950/60">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{name ? `Welcome, ${name}` : `${dashboardRoles[role]} dashboard`}</h1>
        <p className="mt-3 text-muted-foreground">
          {role === "student" ? "Find your next course and keep track of your learning." : "Review tuition listings and access platform management."}
        </p>
      </section>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {dashboardNavigation[role].filter(({ section }) => dashboardLinks.includes(section)).map(({ section, label, icon: Icon, description }) => (
          <li key={section}>
            <Link href={dashboardHref(role, section)} className="group flex h-full flex-col rounded-xl border bg-card p-5 hover:border-indigo-500/60 focus-visible:outline-2">
              <span className="mb-4 grid size-10 place-items-center rounded-lg bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200"><Icon aria-hidden="true" className="size-5" /></span>
              <span className="font-semibold">{label}</span>
              <span className="mt-2 flex-1 text-sm text-muted-foreground">{description}</span>
              <ArrowRight aria-hidden="true" className="mt-4 size-4 text-indigo-700 dark:text-indigo-300" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function DashboardSection({ role, section }: { role: DashboardRole; section: string }) {
  const item = dashboardNavigation[role].find((entry) => entry.section === section)
  if (!item) return null
  const canBrowse = role === "student" && section === "apply-courses"
  return (
    <section className="mx-auto max-w-5xl rounded-2xl border bg-card p-6 sm:p-8">
      <h1 className="text-3xl font-bold tracking-tight">{item.label}</h1>
      <p className="mt-3 text-muted-foreground">{item.description}</p>
      {canBrowse ? (
        <Link href="/tuitions" className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-indigo-700 px-4 font-semibold text-white hover:bg-indigo-800">Browse tuitions</Link>
      ) : <p className="mt-5 rounded-xl border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">This section is not available yet.</p>}
    </section>
  )
}
