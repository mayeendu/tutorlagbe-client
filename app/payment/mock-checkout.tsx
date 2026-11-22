"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"
import { authorizedRequest } from "@/lib/managed-api"
import { notifyError } from "@/lib/notify"

export function MockCheckout({ plan }: { plan: "plus" | "pro" }) {
  const { data, isPending, error } = useSession()
  const router = useRouter()
  const inFlight = useRef(false)
  const [pending, setPending] = useState(false)

  async function start() {
    if (inFlight.current) return
    inFlight.current = true
    setPending(true)
    try {
      const response = await authorizedRequest("/api/payments/mock-checkout", "POST", { plan })
      const { id } = await response.json()
      if (typeof id !== "string" || !/^mock_[\da-f-]{36}$/.test(id)) throw new Error("Invalid demo session.")
      router.push("/checkout/mock?session=" + encodeURIComponent(id))
    } catch (error) {
      notifyError(error, "Could not start demo checkout.")
      inFlight.current = false
      setPending(false)
    }
  }

  return (
    <section className="mt-6 space-y-3 rounded-xl border bg-muted/40 p-4">
      <p className="font-semibold">DEMO PAYMENT - NO REAL CHARGE</p>
      {isPending ? <p role="status">Checking your session…</p>
        : error ? <p role="alert">Could not check your session. Refresh to try again.</p>
          : !data?.user ? <Link href="/sign-in" className="underline">Sign in to continue</Link>
            : data.user.role === "admin" ? <p>Demo checkout is available to students and tutors.</p>
              : <Button disabled={pending} onClick={() => void start()}>{pending ? "Opening checkout…" : "Continue to demo checkout"}</Button>}
      <Link className="block text-sm underline" href="/payment/history">Payment history</Link>
    </section>
  )
}
