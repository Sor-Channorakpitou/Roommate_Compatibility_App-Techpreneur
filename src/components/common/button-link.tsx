import type * as React from "react"

import { Button } from "@/components/ui/button"

type ButtonLinkProps = Omit<
  React.ComponentProps<typeof Button>,
  "render" | "nativeButton"
> &
  Pick<React.ComponentProps<"a">, "href" | "target" | "rel">

/**
 * A link styled as a button.
 *
 * Base UI warns when a component with button semantics renders a non-`<button>`
 * element, so `nativeButton` is turned off here once instead of at every site.
 */
function ButtonLink({ href, target, rel, ...props }: ButtonLinkProps) {
  return (
    <Button
      nativeButton={false}
      render={<a href={href} target={target} rel={rel} />}
      {...props}
    />
  )
}

export { ButtonLink }
