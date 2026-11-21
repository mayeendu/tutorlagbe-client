import {
  Bookmark, BookOpen, CalendarDays, ChartNoAxesCombined, CircleHelp, ClipboardList,
  GraduationCap, LayoutDashboard, PlusCircle, ShieldCheck, Trophy, UsersRound,
  Wallet, type LucideIcon,
} from "lucide-react"

export type DashboardRole = "student" | "tutor" | "admin"

type DashboardLink = {
  section: string
  label: string
  icon: LucideIcon
  description: string
}

export const dashboardRoles: Record<DashboardRole, string> = {
  student: "Student", tutor: "Teacher", admin: "Admin",
}

export const dashboardNavigation: Record<DashboardRole, readonly DashboardLink[]> = {
  student: [
    { section: "", label: "Dashboard", icon: LayoutDashboard, description: "Your learning overview" },
    { section: "my-courses", label: "My courses", icon: BookOpen, description: "View courses you are enrolled in." },
    { section: "apply-courses", label: "Apply courses", icon: GraduationCap, description: "Explore approved tuitions by subject, class level, and lesson format." },
    { section: "my-applications", label: "My applications", icon: ClipboardList, description: "Track your tuition applications and cancel pending requests." },
    { section: "saved-tuitions", label: "Saved Tuitions", icon: Bookmark, description: "Revisit the tuition listings you bookmarked." },
    { section: "my-progress", label: "My progress", icon: ChartNoAxesCombined, description: "Review your learning progress." },
    { section: "my-result", label: "My result", icon: Trophy, description: "See your assessment results." },
    { section: "quiz", label: "Quiz", icon: CircleHelp, description: "Find quizzes for your courses." },
    { section: "events", label: "Events", icon: CalendarDays, description: "Find upcoming learning events." },
  ],
  tutor: [
    { section: "post-tuition", label: "Add course", icon: PlusCircle, description: "Submit a tuition listing for admin review." },
    { section: "my-tuitions", label: "My course", icon: BookOpen, description: "Manage the courses you teach." },
    { section: "applicants", label: "Course application", icon: ClipboardList, description: "Review applications for your courses." },
    { section: "events", label: "Events", icon: CalendarDays, description: "Find upcoming teaching events." },
  ],
  admin: [
    { section: "", label: "Dashboard", icon: LayoutDashboard, description: "Your administration overview" },
    { section: "tuitions", label: "Tuition approvals", icon: ShieldCheck, description: "Approve or reject pending tuition listings." },
    { section: "courses", label: "All courses", icon: BookOpen, description: "Edit or delete published and pending tuition listings." },
    { section: "users", label: "Users", icon: UsersRound, description: "Manage platform accounts and roles." },
    { section: "transactions", label: "Transactions", icon: Wallet, description: "Review platform payments." },
    { section: "events", label: "Events", icon: CalendarDays, description: "Manage platform events." },
  ],
}

export function isDashboardRole(value?: string): value is DashboardRole {
  return value === "student" || value === "tutor" || value === "admin"
}

export function dashboardHref(role: DashboardRole, section = "") {
  return `/dashboard/${role}${section ? `/${section}` : ""}`
}
