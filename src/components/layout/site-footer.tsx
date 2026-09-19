import { Link, useLocation } from "react-router-dom"
import { Flower, ShieldCheck } from "lucide-react"

import { Eyebrow } from "@/components/common/eyebrow"
import { Brand } from "@/components/layout/brand"
import { Container } from "@/components/layout/container"
import { legalLinks, quickLinks, siteConfig } from "@/config/site"

function SiteFooter() {
  const location = useLocation()
  const isMyHomePage = location.pathname === "/my-home"

  if (isMyHomePage) {
    return (
      <footer className="border-t border-[#eee6dc] bg-[#f7f3ed] py-8 text-xs text-muted-foreground">
        <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-heading text-lg font-bold text-primary">
              RoomieMatch
            </span>
            <p>© 2025 RoomieMatch. Mindfully crafted for harmonious co-living.</p>
          </div>
          <nav aria-label="Household legal links" className="flex flex-wrap items-center gap-3 text-xs">
            <Link to="/house-rules" className="transition-colors hover:text-primary">
              House Rules
            </Link>
            <span aria-hidden="true">•</span>
            <Link to="/safety" className="transition-colors hover:text-primary">
              Safety & Trust
            </Link>
            <span aria-hidden="true">•</span>
            <Link to="/privacy" className="transition-colors hover:text-primary">
              Privacy
            </Link>
            <span aria-hidden="true">•</span>
            <Link to="/support" className="transition-colors hover:text-primary">
              Support
            </Link>
          </nav>
        </Container>
      </footer>
    )
  }

  return (
    <footer className="bg-surface shadow-[0_-1px_3px_rgb(92_58_38_/_0.03)]">
      <Container className="flex flex-col gap-12 py-[4.5rem]">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="flex flex-col gap-4 lg:col-span-5">
            <Brand markClassName="h-7 w-[1.3125rem]" />
            <p className="max-w-96 text-[0.9375rem] leading-[1.55] text-muted-foreground">
              {siteConfig.tagline}
            </p>
            <p className="flex items-center gap-2 text-[0.6875rem] leading-[1.2] font-bold tracking-[0.08em] text-sage-foreground uppercase">
              <Flower aria-hidden className="size-3 shrink-0" />
              Rooted in domestic harmony
            </p>
          </div>

          <nav aria-labelledby="footer-quick-links" className="lg:col-span-4">
            <Eyebrow id="footer-quick-links">Quick links</Eyebrow>
            <ul className="mt-3 flex flex-col gap-2">
              {quickLinks.map(({ label, href, icon: Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="flex items-center gap-1.5 rounded-sm text-[0.9375rem] leading-[1.55] text-muted-foreground transition-colors outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <Icon aria-hidden className="size-2.5 shrink-0" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col items-start gap-3 lg:col-span-3">
            <Eyebrow>Mindful living</Eyebrow>
            <p className="text-[0.8125rem] leading-[1.5] text-muted-foreground">
              Connect transparently on sleep patterns, cleanliness expectations,
              and visitor philosophies prior to lease signing.
            </p>
            <p className="flex w-full items-center gap-1.5 rounded-full bg-sage px-3 py-1 text-xs font-semibold tracking-[0.02em] text-sage-foreground">
              <ShieldCheck aria-hidden className="size-2.5 shrink-0" />
              Human Verified Network
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border/40 pt-6 text-[0.8125rem] leading-[1.5] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            Crafted for peaceful shared sanctuaries.
          </p>
          <ul className="flex flex-wrap items-center gap-6">
            {legalLinks.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className="rounded-sm transition-colors outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  )
}

export { SiteFooter }
