import { notFound } from "next/navigation"

import { ManagedProfile } from "@/components/managed-profiles"

export default async function UserProfilePage({ params, searchParams }: PageProps<"/dashboard/admin/users/[id]">) {
  const { id } = await params
  if (!/^[\w-]{1,128}$/.test(id)) notFound()
  return <ManagedProfile key={id} id={id} startEditing={(await searchParams).edit === "1"} />
}
