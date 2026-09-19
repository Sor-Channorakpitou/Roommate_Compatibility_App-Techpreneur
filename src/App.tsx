import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { LandingPage } from "@/features/landing"

export function App() {
  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main"
        className="sr-only rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60]"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1 overflow-x-clip">
        <LandingPage />
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
