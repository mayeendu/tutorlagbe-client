import { notFound } from "next/navigation"

import { DashboardSection } from "@/components/dashboard-pages"
import { dashboardNavigation, isDashboardRole } from "@/lib/dashboard-navigation"

export const dynamicParams = false

export function generateStaticParams() {
  const dedicated = new Set(["post-tuition", "tuitions", "my-tuitions", "courses", "users", "my-applications", "my-courses", "applicants", "transactions"])
  return Object.entries(dashboardNavigation).flatMap(([role, links]) =>
    links.filter(({ section }) => section && !dedicated.has(section))
      .map(({ section }) => ({ role, section }))
  )
}

export default async function DashboardSectionPage({ params }: PageProps<"/dashboard/[role]/[section]">) {
  const { role, section } = await params
  if (!isDashboardRole(role) || !dashboardNavigation[role].some((item) => item.section === section)) notFound()
  return <DashboardSection role={role} section={section} />
}
