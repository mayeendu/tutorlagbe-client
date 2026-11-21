import { cn } from "cn"
import { LoaderIcon } from "lucide-react"
import type { ComponentProps } from "react"

export function Spinner({ className, ...props }: ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 motion-safe:animate-spin", className)}
      {...props}
    />
  )
}
