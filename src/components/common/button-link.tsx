import type * as React from "react"
import type { VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"

type ButtonLinkProps = React.ComponentProps<"a"> &
  VariantProps<typeof buttonVariants>

// Borrows the Button's styles but stays a real anchor. Rendering an <a> through
// the Button primitive stamps role="button" over its link semantics.
function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return (
    <a
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { ButtonLink }
