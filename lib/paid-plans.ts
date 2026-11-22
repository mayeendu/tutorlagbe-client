export const paidPlans = {
  plus: {
    name: "Plus",
    price: "$10",
    priceDetail: "USD one-time",
    description: "Organize your search as you compare tuition options.",
    features: [
      "Everything in Free",
      "Save a shortlist of tuition options",
      "Get alerts for new listings in your subjects",
    ],
  },
  pro: {
    name: "Pro",
    price: "$10–$15",
    priceDetail: "USD one-time · $10 for students, $15 for tutors",
    description: "Get priority booking or grow your tutoring practice.",
    features: [
      "Everything in Free",
      "Priority booking for students",
      "Unlimited tuition listings for tutors",
    ],
  },
}

export type PaidPlan = keyof typeof paidPlans
