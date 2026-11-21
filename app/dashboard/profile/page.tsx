import { ManagedProfile } from "@/components/managed-profiles"

export default async function DashboardProfilePage({ searchParams }: PageProps<"/dashboard/profile">) {
  return <ManagedProfile startEditing={(await searchParams).edit === "1"} />
}
