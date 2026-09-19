import { cn } from "cn"

import brandMark from "@/assets/images/brand-mark.png"
import { siteConfig } from "@/config/site"

type BrandProps = {
  className?: string
  markClassName?: string
  wordmarkClassName?: string
  onClick?: (e: React.MouseEvent) => void
}

/**
 * Logo lockup. The mark is decorative because the wordmark next to it already
 * carries the accessible name of the link.
 */
function Brand({
  className,
  markClassName,
  wordmarkClassName,
  onClick,
}: BrandProps) {
  return (
    <a
      href="/"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <img
        src={brandMark}
        alt=""
        aria-hidden
        width={24}
        height={32}
        className={cn("h-8 w-6 object-contain", markClassName)}
      />
      <span
        className={cn(
          "font-heading text-xl leading-[1.25] tracking-[-0.025em] text-primary",
          wordmarkClassName
        )}
      >
        {siteConfig.name}
      </span>
    </a>
  )
}

export { Brand }
