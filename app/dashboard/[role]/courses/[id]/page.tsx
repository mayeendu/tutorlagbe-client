import { notFound } from "next/navigation"

import { ManagedTuitionDetail } from "@/components/managed-tuitions"

export default async function ManageCoursePage({ params, searchParams }: PageProps<"/dashboard/[role]/courses/[id]">) {
  const { role, id } = await params
  if ((role !== "tutor" && role !== "admin") || !/^[\da-f]{24}$/i.test(id)) notFound()
  return <ManagedTuitionDetail key={id} role={role} id={id} startEditing={(await searchParams).edit === "1"} />
}
