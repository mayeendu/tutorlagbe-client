"use client"

import Form from "next/form"
import type { ComponentProps } from "react"
import { toast } from "sonner"

export function TuitionFilterForm(props: ComponentProps<typeof Form>) {
  return <Form {...props} onSubmit={() => toast.info("Applying tuition filters…", { toasterId: "tuition" })} />
}
