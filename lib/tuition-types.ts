export type Tuition = {
  id: string
  title: string
  subject: string
  classLevel: string
  mode: "Online" | "Offline"
  location: string
  monthlyFee: number
  daysPerWeek: number
  description: string
  tutorName: string
  createdAt: string
}

export type TuitionPage = { items: Tuition[]; hasMore: boolean }

export const tuitionFee = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
})
