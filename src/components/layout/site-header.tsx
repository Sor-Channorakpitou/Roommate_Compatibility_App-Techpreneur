import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { toast } from "sonner"
import { Home, LogOut, Menu, MessageSquare, User, X } from "lucide-react"
import { cn } from "cn"

import { useAuth } from "@/context/auth-context"
import { ButtonLink } from "@/components/common/button-link"
import { Brand } from "@/components/layout/brand"
import { Container } from "@/components/layout/container"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { mainNav, type NavLink } from "@/config/site"

function NavItem({ link }: { link: NavLink }) {
  const location = useLocation()
  const isActive =
    location.pathname === link.href ||
    (link.href === "/find-roommates" &&
      (location.pathname === "/find-roommates" || location.pathname === "/browse")) ||
    (link.href === "/browse" &&
      (location.pathname === "/browse" || location.pathname === "/find-roommates"))

  return (
    <Link
      to={link.href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "px-2 font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive
          ? "border-b-2 border-[#7a3418] pt-2 pb-1.5 text-base font-semibold text-[#7a3418]"
          : "py-2 text-sm tracking-[0.01em] text-muted-foreground hover:text-primary"
      )}
    >
      {link.label}
    </Link>
  )
}

function ActionButtons() {
  return (
    <>
      <Button
        nativeButton={false}
        variant="ghost"
        size="pill-xs"
        className="bg-muted text-foreground hover:bg-muted/70"
        render={<Link to="/messages" />}
      >
        <MessageSquare />
        Messages
        <span aria-hidden className="ml-0.5 size-2 rounded-full bg-primary" />
        <span className="sr-only">(unread messages)</span>
      </Button>
      <Button
        nativeButton={false}
        variant="brand-outline"
        size="pill-xs"
        className="px-[1.0625rem]"
        render={<Link to="/rooms/new" />}
      >
        Create Room
      </Button>
    </>
  )
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function UserMenu({ className }: { className?: string }) {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!isOpen) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [isOpen])

  React.useEffect(() => {
    if (!isOpen) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false)
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [isOpen])

  function handleLogout() {
    logout()
    setIsOpen(false)
    toast.success("Signed out successfully", {
      description: "See you next time!",
    })
  }

  const displayName = user ? user.name : "Sopheak Chan"
  const displayEmail = user ? user.email : "sopheak.chan@student.edu.kh"

  return (
    <div ref={menuRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User profile menu"
        className="flex size-9 items-center justify-center rounded-full border border-foreground/30 text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {user ? (
          <Avatar size="sm">
            <AvatarFallback className="bg-primary/12 text-xs font-bold text-primary">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <User className="size-4 text-foreground/80" />
        )}
      </button>

      <div
        className={cn(
          "absolute top-full right-0 z-50 mt-2 w-52 origin-top-right rounded-xl bg-card p-1.5 shadow-floating ring-1 ring-foreground/10 transition-all duration-200 ease-out",
          isOpen
            ? "visible scale-100 opacity-100"
            : "pointer-events-none invisible scale-95 opacity-0"
        )}
        role="menu"
      >
        <div className="px-3 py-2.5">
          <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
          <p className="truncate text-xs text-muted-foreground">{displayEmail}</p>
        </div>

        <div className="mx-2 h-px bg-border/60" />

        <Link
          to="/my-home"
          role="menuitem"
          onClick={() => setIsOpen(false)}
          className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
        >
          <Home className="size-4 text-muted-foreground" />
          My Home
        </Link>
        <Link
          to="/"
          role="menuitem"
          onClick={() => setIsOpen(false)}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
        >
          <User className="size-4 text-muted-foreground" />
          Profile
        </Link>

        <div className="mx-2 my-1 h-px bg-border/60" />

        {user ? (
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="mb-0.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/8"
          >
            <LogOut className="size-4" />
            Log Out
          </button>
        ) : (
          <Link
            to="/sign-in"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="mb-0.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-primary transition-colors hover:bg-muted"
          >
            <User className="size-4" />
            Sign In / Register
          </Link>
        )}
      </div>
    </div>
  )
}

function MobileUserSection() {
  const { user, logout } = useAuth()

  if (!user) return null

  function handleLogout() {
    logout()
    toast.success("Signed out successfully", {
      description: "See you next time!",
    })
  }

  return (
    <div className="flex flex-col gap-1 border-t border-border/40 pt-3">
      <div className="flex items-center gap-3 px-2 py-2">
        <Avatar size="sm">
          <AvatarFallback className="bg-primary/12 text-xs font-bold text-primary">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {user.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <Link
        to="/"
        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-foreground hover:bg-muted"
      >
        <User className="size-4 text-muted-foreground" />
        Profile
      </Link>
      <Link
        to="/my-home"
        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-foreground hover:bg-muted"
      >
        <Home className="size-4 text-muted-foreground" />
        My Home
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-destructive hover:bg-destructive/8"
      >
        <LogOut className="size-4" />
        Log Out
      </button>
    </div>
  )
}

function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 shadow-header backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between gap-6">
        <Brand />

        <nav aria-label="Main" className="hidden items-center gap-12 lg:flex">
          {mainNav.map((link) => (
            <NavItem key={link.href} link={link} />
          ))}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">

          <ActionButtons />

          {user ? (
            <UserMenu />
          ) : (
            <Button
              nativeButton={false}
              variant="ghost"
              size="pill-xs"
              className="text-foreground"
              render={<Link to="/sign-in" />}
            >
              Sign In
            </Button>
          )}
        </div>

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
            <div className="flex flex-wrap items-center gap-3">
              <ActionButtons />
              {!user && (
                <ButtonLink
                  href="/sign-in"
                  variant="ghost"
                  size="pill-xs"
                  className="text-foreground"
                >
                  Sign In
                </ButtonLink>
              )}
            </div>
            {user && <MobileUserSection />}
          </Container>
        </div>
      ) : null}
    </header>
  )
}

export { SiteHeader }
