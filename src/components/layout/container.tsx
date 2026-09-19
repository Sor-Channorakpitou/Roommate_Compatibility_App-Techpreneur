import type * as React from "react"
import { cn } from "cn"

// 1240px max width, matching the Figma layout grid.
function Container({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="container"
      className={cn("mx-auto w-full max-w-[1240px] px-5 sm:px-8", className)}
      {...props}
    />
  )
}

export { Container }
