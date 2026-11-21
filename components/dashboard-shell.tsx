"use client"

import { ArrowUpRight, Menu, PanelLeftClose, PanelLeftOpen, UserRound, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"

import { LoadingSkeleton } from "@/components/loading-skeleton"
import { Button } from "@/components/ui/button"
import { useManagedResource } from "@/hooks/use-managed-resource"
import { useSession } from "@/lib/auth-client"
import { dashboardHref, dashboardNavigation, dashboardRoles, isDashboardRole } from "@/lib/dashboard-navigation"

type DashboardUser = NonNullable<ReturnType<typeof useSession>["data"]>["user"]

export function DashboardAvatar({ user }: { user: Pick<DashboardUser, "name" | "image"> }) {
  const [failedImage, setFailedImage] = useState<string>()
  const photo = user.image ? URL.parse(user.image) : null
  const image = photo && ["https:", "http:"].includes(photo.protocol) && !photo.username && !photo.password
    ? photo.href : undefined
  const initials = user.name.trim().split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase()

  return (
    <span className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-full bg-indigo-100 text-xl font-semibold text-indigo-800 ring-2 ring-indigo-600/15 dark:bg-indigo-950 dark:text-indigo-200" aria-hidden="true">
      {image && image !== failedImage ? (
        <Image src={image} alt="" fill sizes="64px" unoptimized referrerPolicy="no-referrer" className="object-cover" onError={() => setFailedImage(image)} />
      ) : initials || <UserRound className="size-7" />}
    </span>
  )
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const { data, isPending, error } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const user = data?.user
  const role = isDashboardRole(user?.role) ? user.role : undefined
  const profilePath = user && (role === "tutor" || role === "student")
    ? `/api/profiles/${encodeURIComponent(user.id)}`
    : null
  const { data: profile, error: profileError } = useManagedResource<{ plan: string }>(profilePath)
  const plan = profile?.plan ?? (profileError ? user?.plan : undefined)
  const pathRole = pathname.split("/")[2]

  useEffect(() => {
    if (role && pathname === "/dashboard") router.replace(dashboardHref(role))
  }, [pathname, role, router])

  if (isPending) return <main className="mx-auto max-w-4xl px-5 py-16"><LoadingSkeleton label="Checking your session…" showHeading /></main>
  if (error) return <main className="mx-auto max-w-4xl px-5 py-16"><p role="alert">Your session could not be checked. Refresh and try again.</p></main>
  if (!user || !role) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-16">
        <h1 className="text-3xl font-semibold">{user ? "Dashboard access unavailable" : "Sign in to your dashboard"}</h1>
        <p className="mt-3 text-muted-foreground">{user ? "Your account does not have a dashboard role." : "Sign in to continue to your workspace."}</p>
        {!user && <Link href="/sign-in" className="mt-5 inline-flex rounded-lg bg-indigo-700 px-4 py-2 font-semibold text-white">Sign in</Link>}
      </main>
    )
  }

  const allowed = !isDashboardRole(pathRole) || pathRole === role
  const title = pathname === "/dashboard/profile" ? "Profile" :
    dashboardNavigation[role].find((item) => dashboardHref(role, item.section) === pathname)?.label ?? "Dashboard"

  return (
    <div className="min-h-[70vh] bg-muted/30">
      <div className="mx-auto grid max-w-400 items-start lg:grid-cols-[auto_minmax(0,1fr)]">
        <div className="flex min-w-0 items-center gap-2 border-b bg-background px-4 py-3 lg:col-span-2 lg:px-7">
          <Button variant="outline" size="icon" className="size-10 lg:hidden" aria-label={mobileOpen ? "Close dashboard sidebar" : "Open dashboard sidebar"} aria-expanded={mobileOpen} aria-controls="dashboard-sidebar" onClick={() => setMobileOpen((open) => !open)}>
            {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
          <Button variant="outline" size="icon" className="hidden size-10 lg:inline-flex" aria-label={sidebarOpen ? "Collapse dashboard sidebar" : "Expand dashboard sidebar"} aria-expanded={sidebarOpen} aria-controls="dashboard-sidebar" onClick={() => setSidebarOpen((open) => !open)}>
            {sidebarOpen ? <PanelLeftClose aria-hidden="true" /> : <PanelLeftOpen aria-hidden="true" />}
          </Button>
          <span className="text-sm font-semibold text-muted-foreground">{dashboardRoles[role]} dashboard</span>
          <span aria-hidden="true" className="text-muted-foreground">/</span>
          <span className="truncate text-sm font-semibold">{title}</span>
          <Link href="/tuitions" className="ml-auto hidden shrink-0 items-center gap-1 text-sm font-medium text-indigo-700 hover:underline sm:inline-flex dark:text-indigo-300">
            Browse tuitions <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <aside id="dashboard-sidebar" className={`${mobileOpen ? "block" : "hidden"} ${sidebarOpen ? "lg:block" : "lg:hidden"} border-b bg-background p-4 lg:min-h-[65vh] lg:w-64 lg:border-r lg:border-b-0 lg:p-5`}>
          <div className="mb-5 flex flex-col items-center gap-2 rounded-xl border bg-muted/40 p-4 text-center">
            <DashboardAvatar user={user} />
            <p className="font-semibold wrap-anywhere">{user.name}</p>
            <p className="text-sm text-muted-foreground">{dashboardRoles[role]}</p>
            {role !== "admin" && <Link href="/pricing" className="text-sm font-semibold text-indigo-700 hover:underline dark:text-indigo-300">{plan === "pro" ? "Pro user" : plan === "plus" ? "Plus user" : plan === "free" ? "Free · View Pro plans" : "View plans"}</Link>}
            <Link href="/dashboard/profile" aria-current={pathname === "/dashboard/profile" ? "page" : undefined} onClick={() => setMobileOpen(false)} className="mt-1 inline-flex min-h-10 items-center gap-2 rounded-lg border bg-background px-3 text-sm font-semibold hover:bg-muted aria-[current=page]:border-indigo-500">
              <UserRound aria-hidden="true" className="size-4" /> Profile
            </Link>
          </div>
          <nav aria-label={`${dashboardRoles[role]} dashboard navigation`} className="grid gap-1">
            {dashboardNavigation[role].map(({ section, label, icon: Icon }) => {
              const href = dashboardHref(role, section)
              return (
                <Link key={href} href={href} onClick={() => setMobileOpen(false)} aria-current={pathname === href ? "page" : undefined} className="flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted focus-visible:outline-2 aria-[current=page]:bg-indigo-100 aria-[current=page]:text-indigo-800 dark:aria-[current=page]:bg-indigo-950 dark:aria-[current=page]:text-indigo-200">
                  <Icon aria-hidden="true" className="size-4 shrink-0" /> {label}
                </Link>
              )
            })}
          </nav>
        </aside>

        <main className={`min-w-0 p-5 sm:p-8 ${sidebarOpen ? "" : "lg:col-span-2"}`}>
          {!allowed ? (
            <div className="rounded-2xl border bg-card p-6">
              <h1 className="text-2xl font-semibold">This dashboard belongs to another role</h1>
              <Link href={dashboardHref(role)} className="mt-4 inline-block font-semibold underline">Open your dashboard</Link>
            </div>
          ) : pathname === "/dashboard" ? <LoadingSkeleton label="Opening your dashboard…" showHeading /> : children}
        </main>
      </div>
    </div>
  )
}
