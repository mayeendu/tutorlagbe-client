export type ApplicationStatus = "pending" | "accepted" | "rejected"

type Application = {
  id: string
  tuitionId: string
  tuitionTitle: string
  subject: string
  monthlyFee: number
  status: ApplicationStatus
  preferredSchedule: string
  appliedAt: string
}

export type TuitionReview = { rating: number; feedback: string; createdAt: string }
export type TuitionReviewPage = { items: TuitionReview[]; hasMore: boolean }
export type StudentApplication = Application & { tutorName: string; tutorEmail: string; review?: TuitionReview }
export type ReceivedApplication = Application & {
  studentName: string; studentEmail: string; studentPhone: string; studentNote: string
}
export type ApplicationPage<T extends Application> = { items: T[]; hasMore: boolean }
