"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useId, useState, type FormEvent } from "react"

import { DashboardAvatar } from "@/components/dashboard-shell"
import { DeleteRecord } from "@/components/delete-record"
import { ImageUpload, uploadSelectedImage } from "@/components/image-upload"
import { Button } from "@/components/ui/button"
import { useManagedResource } from "@/hooks/use-managed-resource"
import { authClient, useSession } from "@/lib/auth-client"
import { dashboardRoles, type DashboardRole } from "@/lib/dashboard-navigation"
import { authorizedRequest } from "@/lib/managed-api"

type Profile = {
  id: string; name: string; email: string; role: DashboardRole; plan: string
  image?: string | null; phone?: string; bio?: string
}

const field = "rounded-lg border bg-background px-3 py-2.5 text-base"
const label = "grid gap-1.5 text-sm font-medium"

export function ManagedProfile({ id, startEditing = false }: { id?: string; startEditing?: boolean }) {
  const session = useSession()
  const router = useRouter()
  const editFormId = useId()
  const user = session.data?.user
  const profileId = id ?? user?.id
  const path = profileId ? `/api/profiles/${encodeURIComponent(profileId)}` : null
  const { data, error, reload } = useManagedResource<Profile>(path)
  const [updated, setUpdated] = useState<Profile>()
  const [editing, setEditing] = useState(startEditing)
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState("")
  const item = updated?.id === profileId ? updated : data
  const isOwn = user?.id === profileId

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!path || pending) return
    const values = new FormData(event.currentTarget)
    const image = String(values.get("image") ?? "").trim()
    setPending(true)
    setMessage("")
    try {
      const uploaded = await uploadSelectedImage(values.get("photoFile"))
      const response = await authorizedRequest(path, "PATCH", {
        name: values.get("name"), phone: values.get("phone"), bio: values.get("bio"), image: uploaded ?? (image || null),
      })
      setUpdated(await response.json())
      setEditing(false)
      if (isOwn) void session.refetch()
    } catch (failure) {
      setMessage(failure instanceof Error ? failure.message : "Could not save profile.")
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="mx-auto max-w-5xl rounded-2xl border bg-card p-6 sm:p-8">
      {id && <Link href="/dashboard/admin/users" className="mb-4 inline-block text-sm font-semibold underline">Back to users</Link>}
      <h1 className="text-3xl font-bold tracking-tight">{id ? "User profile" : "Profile"}</h1>
      {error ? (
        <div className="mt-4 space-y-4">
          {isOwn && user && <div className="flex flex-wrap items-center gap-4">
            <DashboardAvatar user={user} />
            <div><p className="font-semibold">{user.name}</p><p className="text-sm text-muted-foreground wrap-anywhere">{user.email}</p></div>
          </div>}
          <div role="alert">{error.message} <Button variant="outline" onClick={reload}>Retry</Button></div>
        </div>
      ) : !item ? <p role="status" className="mt-4">Loading profile…</p> : (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-4 border-b pb-6">
            <DashboardAvatar user={item} />
            {editing && (
              <div className="min-w-0 max-w-full sm:ms-2">
                <ImageUpload name="photoFile" label="Upload profile photo" form={editFormId} disabled={pending} />
              </div>
            )}
            <div className="min-w-0 wrap-anywhere">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.email}</p>
              <p className="text-sm text-muted-foreground">{dashboardRoles[item.role]}{item.plan && ` · ${item.plan}`}</p>
            </div>
          </div>
          {editing ? (
            <form id={editFormId} onSubmit={save} className="mt-6">
              <fieldset disabled={pending} className="grid gap-4 sm:grid-cols-2">
                <label className={label}>Name<input className={field} name="name" autoComplete="name" defaultValue={item.name} required minLength={2} maxLength={100} /></label>
                <label className={label}>Phone<input className={field} name="phone" type="tel" autoComplete="tel" defaultValue={item.phone} maxLength={30} /></label>
                <label className={`${label} sm:col-span-2`}>Photo URL<input className={field} name="image" type="url" defaultValue={item.image ?? ""} maxLength={2048} /></label>
                <label className={`${label} sm:col-span-2`}>Bio<textarea className={field} name="bio" defaultValue={item.bio} maxLength={1000} rows={4} /></label>
                <div className="flex flex-wrap gap-2">
                  <Button type="submit">{pending ? "Saving…" : "Save changes"}</Button>
                  <Button type="button" variant="outline" onClick={() => { setEditing(false); setMessage("") }}>Cancel</Button>
                </div>
              </fieldset>
              {message && <p role="alert" className="mt-3 text-sm text-destructive">{message}</p>}
            </form>
          ) : (
            <>
              {updated && <p role="status" className="mt-4 text-sm">Profile saved.</p>}
              <dl className="my-5 grid gap-5 sm:grid-cols-2">
                <div><dt className="text-sm text-muted-foreground">Phone</dt><dd>{item.phone || "No phone added"}</dd></div>
                <div><dt className="text-sm text-muted-foreground">Bio</dt><dd className="whitespace-pre-wrap wrap-anywhere">{item.bio || "No bio added"}</dd></div>
              </dl>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setEditing(true)}>Edit profile</Button>
                {user?.role === "admin" && path && (
                  <DeleteRecord label="profile" path={path} onDeleted={() => {
                    if (isOwn) {
                      void authClient.signOut().catch(() => undefined).finally(() => { router.replace("/sign-in"); router.refresh() })
                    } else {
                      router.replace("/dashboard/admin/users")
                      router.refresh()
                    }
                  }} />
                )}
              </div>
            </>
          )}
        </>
      )}
    </section>
  )
}

export function ManagedUserList() {
  const [page, setPage] = useState(1)
  const { data, error, reload } = useManagedResource<{ items: Profile[]; hasMore: boolean }>(`/api/profiles?page=${page}`)
  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <h1 className="text-3xl font-bold tracking-tight">Users</h1>
      {error ? <div role="alert">{error.message} <Button variant="outline" onClick={reload}>Retry</Button></div> : !data ? <p role="status">Loading users…</p> : data.items.length ? (
        <ul className="space-y-3">
          {data.items.map((user) => (
            <li key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4">
              <div className="min-w-0 wrap-anywhere">
                <h2 className="font-semibold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email} · {dashboardRoles[user.role]}</p>
              </div>
              <Link className="text-sm font-semibold underline" href={`/dashboard/admin/users/${encodeURIComponent(user.id)}`}>Manage profile<span className="sr-only"> for {user.name}</span></Link>
            </li>
          ))}
        </ul>
      ) : <p className="text-muted-foreground">No profiles on this page.</p>}
      {data && (page > 1 || data.hasMore) && <nav aria-label="User management pages" className="flex gap-2">
        {page > 1 && <Button variant="outline" onClick={() => setPage(page - 1)}>Previous page</Button>}
        {data.hasMore && <Button variant="outline" onClick={() => setPage(page + 1)}>Next page</Button>}
      </nav>}
    </section>
  )
}
