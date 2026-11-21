"use client"

import { useState } from "react"

import { LoadingSkeleton } from "@/components/loading-skeleton"
import { Button } from "@/components/ui/button"
import { useManagedResource } from "@/hooks/use-managed-resource"

type Transaction = {
  _id: string; userName?: string; userEmail?: string; userRole?: "student" | "tutor";
  transactionId?: string; amount: number; currency: "usd"; planName: string;
  paidAt?: string; date?: string; status?: "pending" | "paid" | "failed" | "expired"
}
const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
const dates = new Intl.DateTimeFormat("en-BD", { dateStyle: "medium", timeZone: "Asia/Dhaka" })

export function StripeTransactions({ personal = false }: { personal?: boolean }) {
  const [page, setPage] = useState(1)
  const { data, error, reload } = useManagedResource<{ items: Transaction[]; hasMore: boolean }>(
    `/api/payments/${personal ? "history" : "transactions"}?page=${page}`,
  )
  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">{personal ? "Payment history" : "Transactions"}</h1>
        <Button variant="outline" onClick={reload}>Refresh</Button>
      </div>
      {error ? <p role="alert">{error.message}</p> : !data ? <LoadingSkeleton label="Loading payments…" /> : data.items.length ? (
        <ul className="grid gap-3">
          {data.items.map((payment) => {
            const date = payment.date ?? payment.paidAt
            return (
            <li key={payment._id} className="rounded-xl border bg-card p-4 wrap-anywhere sm:p-5">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{personal ? payment.planName : payment.userName}</h2>
                  {!personal && <p className="text-sm text-muted-foreground">{payment.userEmail}</p>}
                </div>
                <p className="font-semibold">{dollars.format(payment.amount / 100)}</p>
              </div>
              <p className="mt-2 text-sm">
                {personal ? <span className="capitalize">{payment.status}</span> : `${payment.planName} · ${payment.userRole === "tutor" ? "Teacher" : "Student"}`}
                {date && ` · ${dates.format(new Date(date))}`}
              </p>
              {payment.transactionId && <p className="mt-1 text-xs text-muted-foreground">Stripe transaction {payment.transactionId}</p>}
            </li>
            )
          })}
        </ul>
      ) : <p className="rounded-xl border border-dashed p-5 text-muted-foreground">No payments on this page.</p>}
      {data && (page > 1 || data.hasMore) && <nav aria-label="Transaction pages" className="flex gap-2">
        {page > 1 && <Button variant="outline" onClick={() => setPage(page - 1)}>Previous page</Button>}
        {data.hasMore && <Button variant="outline" onClick={() => setPage(page + 1)}>Next page</Button>}
      </nav>}
    </section>
  )
}
