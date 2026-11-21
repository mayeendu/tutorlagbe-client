"use client"

import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"

import { useSession } from "@/lib/auth-client"
import { dashboardHref, isDashboardRole } from "@/lib/dashboard-navigation"

export default function SignUpLayout({ children }: { children: ReactNode }) {
  const { data, isPending, error } = useSession()
  const router = useRouter()
  const user = data?.user
  const destination = user
    ? isDashboardRole(user.role) ? dashboardHref(user.role) : "/dashboard"
    : undefined

  useEffect(() => {
    if (destination) router.replace(destination)
  }, [destination, router])

  if (!destination && !isPending && !error) return children

  return (
    <main className="mx-auto max-w-4xl px-5 py-16">
      {destination ? (
        <p role="status">Opening your dashboard…</p>
      ) : isPending ? (
        <p role="status">Checking your session…</p>
      ) : (
        <p role="alert">Your session could not be checked. Refresh and try again.</p>
      )}
    </main>
  )
}
