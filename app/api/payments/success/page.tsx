import { redirect } from "next/navigation"

export default async function LegacyPaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string | string[] }>
}) {
  const { session_id: id } = await searchParams
  if (typeof id === "string" && /^cs_\w{1,200}$/.test(id)) {
    redirect(`/payment/success?session_id=${encodeURIComponent(id)}`)
  }
  redirect("/payment/success")
}
