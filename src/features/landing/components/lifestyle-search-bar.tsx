import { Search } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { searchFields } from "@/features/landing/data/landing-content"

/** Floating three-field search bar that sits above the hero. */
function LifestyleSearchBar({ className }: { className?: string }) {
  return (
    <form
      action="/browse"
      aria-label="Find a roommate"
      className={cn(
        "flex flex-col gap-1 rounded-2xl border border-border/50 bg-card/90 p-[0.8125rem] shadow-floating backdrop-blur-md md:flex-row md:items-center",
        className
      )}
    >
      {searchFields.map(({ id, name, label, placeholder, icon: Icon }, i) => (
        <div key={id} className="contents">
          {i > 0 ? (
            <Separator
              orientation="vertical"
              aria-hidden
              className="mx-1 hidden h-10 bg-border/40 md:block"
            />
          ) : null}
          <div className="flex flex-1 items-center gap-2 rounded-xl px-4 py-2 transition-colors focus-within:bg-muted/60">
            <Icon
              aria-hidden
              className="size-4 shrink-0 text-muted-foreground"
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <label
                htmlFor={id}
                className="text-[0.6875rem] leading-[1.2] font-bold tracking-[0.08em] text-muted-foreground uppercase"
              >
                {label}
              </label>
              <Input
                id={id}
                name={name}
                placeholder={placeholder}
                className="h-auto rounded-none border-0 bg-transparent p-0 text-[0.8125rem] placeholder:text-muted-foreground/60 focus-visible:border-0 focus-visible:ring-0 md:text-[0.8125rem] dark:bg-transparent"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="p-1 md:pl-2">
        <Button type="submit" size="pill" className="w-full shadow-card">
          <Search aria-hidden className="size-3" />
          Search
        </Button>
      </div>
    </form>
  )
}

export { LifestyleSearchBar }
