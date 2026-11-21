"use client"

import { Menu as AccountMenu } from "@base-ui/react/menu"
import { Popover } from "@base-ui/react/popover"
import { ChevronDown, CircleDollarSign, Menu } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { SiteBrand } from "@/components/site-brand"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { authClient, useSession } from "@/lib/auth-client"

const links = [
  { href: "/tuitions", label: "Our courses" },
  { href: "/teachers", label: "Our teachers" },
  { href: "/learning-materials", label: "Resources" },
]

const menuLinkClass =
  "block rounded-md px-1 py-1 font-sm hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"

type AccountUser = NonNullable<ReturnType<typeof useSession>["data"]>["user"]

const roleNavigation = new Map([
  ["admin", { label: "Admin", dashboard: "/dashboard/admin" }],
  ["student", { label: "Student", dashboard: "/dashboard/student" }],
  ["tutor", { label: "Tutor", dashboard: "/dashboard/tutor" }],
])

function AccountDropdown({
  user,
  onNavigate,
}: {
  user: AccountUser
  onNavigate?: () => void
}) {
  const [signingOut, setSigningOut] = useState(false)
  const [error, setError] = useState(false)
  const role = roleNavigation.get(user.role ?? "")
  const itemClass =
    "block cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium outline-none data-highlighted:bg-muted"

  async function handleSignOut() {
    if (signingOut) return
    setSigningOut(true)
    setError(false)

    try {
      const result = await authClient.signOut()
      if (result.error) {
        setError(true)
        return
      }
      onNavigate?.()
    } catch {
      setError(true)
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <AccountMenu.Root
      onOpenChange={(open) => {
        if (!open) setError(false)
      }}
    >
      <AccountMenu.Trigger
        render={<Button variant="outline" />}
        className="col-span-2 h-11 max-w-full min-w-0 gap-2 px-3"
      >
        <span className="truncate">
          Welcome, {user.name.trim().split(/\s+/)[0] || "there"}
        </span>
        {role && (
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200">
            {role.label}
          </span>
        )}
        <ChevronDown aria-hidden="true" className="size-4" />
      </AccountMenu.Trigger>
      <AccountMenu.Portal>
        <AccountMenu.Positioner
          align="end"
          sideOffset={8}
          collisionPadding={12}
          className="z-60"
        >
          <AccountMenu.Popup className="w-48 rounded-xl border bg-popover p-1.5 text-popover-foreground shadow-lg">
            <AccountMenu.LinkItem
              render={
                <Link href="/dashboard/profile" onNavigate={onNavigate} />
              }
              closeOnClick
              className={itemClass}
            >
              Profile
            </AccountMenu.LinkItem>
            <AccountMenu.LinkItem
              render={
                <Link
                  href={role?.dashboard ?? "/dashboard"}
                  onNavigate={onNavigate}
                />
              }
              closeOnClick
              className={itemClass}
            >
              Dashboard
            </AccountMenu.LinkItem>
            <AccountMenu.Separator className="my-1 border-t" />
            <AccountMenu.Item
              label="Sign Out"
              disabled={signingOut}
              closeOnClick={false}
              onClick={handleSignOut}
              className={`${itemClass} text-destructive data-disabled:cursor-wait data-disabled:opacity-60`}
            >
              {signingOut ? "Signing out…" : "Sign Out"}
            </AccountMenu.Item>
            {error && (
              <p role="alert" className="px-3 py-2 text-xs text-destructive">
                Couldn’t sign out. Try again.
              </p>
            )}
          </AccountMenu.Popup>
        </AccountMenu.Positioner>
      </AccountMenu.Portal>
    </AccountMenu.Root>
  )
}

function AuthActions({
  user,
  isPending,
  onNavigate,
}: {
  user?: AccountUser
  isPending: boolean
  onNavigate?: () => void
}) {
  if (user) {
    return <AccountDropdown user={user} onNavigate={onNavigate} />
  }

  if (isPending) return null

  return (
    <>
      <Button
        variant="outline"
        nativeButton={false}
        render={<Link href="/sign-in" onNavigate={onNavigate} />}
        className="h-11 px-5"
      >
        Sign in
      </Button>
      <Button
        nativeButton={false}
        render={<Link href="/sign-up" onNavigate={onNavigate} />}
        className="h-11 bg-indigo-700 px-5 text-white hover:bg-indigo-800"
      >
        Sign up
      </Button>
    </>
  )
}

export function SiteNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: session, isPending } = useSession()

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-400 grid-cols-[1fr_auto] items-center gap-2 px-3 py-3 max-sm:[&>a>span:last-child]:text-lg sm:px-7 lg:min-h-22 lg:grid-cols-[1fr_auto_auto] lg:gap-4 xl:grid-cols-[1fr_auto_1fr] xl:px-10">
        <SiteBrand />

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 lg:flex xl:gap-4"
        >
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className={menuLinkClass}>
              {label}
            </Link>
          ))}
          <Popover.Root>
            <Popover.Trigger
              render={<Button variant="ghost" />}
              className="group h-11 gap-2 px-3 text-base"
            >
              Pages
              <ChevronDown
                aria-hidden="true"
                className="size-4 transition-transform group-data-popup-open:rotate-180"
              />
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Positioner
                sideOffset={8}
                align="start"
                className="z-50 hidden lg:block"
              >
                <Popover.Popup
                  aria-label="Pages"
                  className="w-40 rounded-xl border bg-popover p-1.5 text-popover-foreground shadow-lg"
                >
                  <Popover.Close
                    nativeButton={false}
                    render={<Link href="/" />}
                    className={menuLinkClass}
                  >
                    Home
                  </Popover.Close>
                </Popover.Popup>
              </Popover.Positioner>
            </Popover.Portal>
          </Popover.Root>
        </nav>

        <div className="flex min-w-0 items-center justify-self-end gap-1 sm:gap-2">
          <Link href="/pricing" className="inline-flex h-10 shrink-0 items-center rounded-lg px-2 text-sm font-semibold hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring">
            <CircleDollarSign aria-hidden="true" className="size-5 sm:hidden" />
            <span className="sr-only sm:not-sr-only">Pricing</span>
          </Link>
          <ThemeToggle />
          <div className="hidden min-w-0 items-center gap-2 lg:flex">
            <AuthActions user={session?.user} isPending={isPending} />
          </div>
          <div className="lg:hidden">
            <Popover.Root open={mobileOpen} onOpenChange={setMobileOpen}>
              <Popover.Trigger
                aria-label="Navigation menu"
                render={<Button variant="outline" />}
                className="size-11"
              >
                <Menu aria-hidden="true" className="size-5" />
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Positioner
                  align="end"
                  sideOffset={12}
                  collisionPadding={16}
                  className="z-50 lg:hidden"
                >
                  <Popover.Popup
                    aria-label="Navigation menu"
                    className="w-[min(22rem,calc(100vw-2rem))] rounded-xl border bg-popover p-2 text-popover-foreground shadow-lg"
                  >
                    <nav aria-label="Main navigation">
                      {links.map(({ href, label }) => (
                        <Popover.Close
                          key={href}
                          nativeButton={false}
                          render={<Link href={href} />}
                          className={menuLinkClass}
                        >
                          {label}
                        </Popover.Close>
                      ))}
                      <details className="group">
                        <summary
                          className={`${menuLinkClass} flex cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden`}
                        >
                          Pages
                          <ChevronDown
                            aria-hidden="true"
                            className="size-4 transition-transform group-open:rotate-180"
                          />
                        </summary>
                        <Popover.Close
                          nativeButton={false}
                          render={<Link href="/" />}
                          className={`ml-3 ${menuLinkClass}`}
                        >
                          Home
                        </Popover.Close>
                      </details>
                    </nav>
                    <div className="mt-2 grid grid-cols-2 gap-2 border-t p-2 pt-3">
                      <AuthActions
                        user={session?.user}
                        isPending={isPending}
                        onNavigate={() => setMobileOpen(false)}
                      />
                    </div>
                  </Popover.Popup>
                </Popover.Positioner>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>
      </div>
    </header>
  )
}
