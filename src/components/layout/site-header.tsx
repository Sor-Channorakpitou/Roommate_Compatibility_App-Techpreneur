import * as React from "react"
import { Menu, MessageSquare, X } from "lucide-react"
import { cn } from "cn"

import { ButtonLink } from "@/components/common/button-link"
import { Brand } from "@/components/layout/brand"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { mainNav, type NavLink } from "@/config/site"

// This page is the site root, so "Home" is the current nav item.
const CURRENT_PATH = "/"

function NavItem({ link }: { link: NavLink }) {
  const isActive = link.href === CURRENT_PATH

  return (
    <a
      href={link.href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "rounded-sm px-4 font-semibold transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        isActive
          ? "border-b-2 border-primary pt-2 pb-2.5 text-base text-primary"
          : "py-2 text-sm tracking-[0.01em] text-muted-foreground hover:text-primary"
      )}
    >
      {link.label}
    </a>
  )
}

function HeaderActions({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <ButtonLink
        href="/messages"
        variant="ghost"
        size="pill-xs"
        className="bg-muted text-foreground hover:bg-muted/70"
      >
        <MessageSquare />
        Messages
        <span aria-hidden className="ml-0.5 size-2 rounded-full bg-primary" />
        <span className="sr-only">(unread messages)</span>
      </ButtonLink>
      <ButtonLink
        href="/rooms/new"
        variant="brand-outline"
        size="pill-xs"
        className="px-[1.0625rem]"
      >
        Create Room
      </ButtonLink>
      <ButtonLink
        href="/sign-in"
        variant="ghost"
        size="pill-xs"
        className="text-foreground"
      >
        Sign In
      </ButtonLink>
    </div>
  )
}

function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 shadow-header backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between gap-6">
        <Brand />

        <nav aria-label="Main" className="hidden items-center gap-12 lg:flex">
          {mainNav.map((link) => (
            <NavItem key={link.href} link={link} />
          ))}
        </nav>

        <HeaderActions className="hidden lg:flex" />

        <Button
          variant="ghost"
          size="icon-lg"
          className="lg:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </Container>

      {isMenuOpen ? (
        <div
          id="mobile-nav"
          className="border-t border-border/40 bg-background/95 lg:hidden"
        >
          <Container className="flex flex-col gap-4 py-4">
            <nav aria-label="Main" className="flex flex-col items-start gap-1">
              {mainNav.map((link) => (
                <NavItem key={link.href} link={link} />
              ))}
            </nav>
            <HeaderActions className="flex-wrap" />
          </Container>
        </div>
      ) : null}
    </header>
  )
}

export { SiteHeader }
