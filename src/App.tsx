import { BrowserRouter, Routes, Route } from "react-router-dom"

import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { Toaster } from "@/components/ui/sonner"
import { LoginPage, RegisterPage } from "@/features/auth"
import { CompatibilityPage } from "@/features/compatibility"
import { FindRoommatesPage } from "@/features/find-roommates"
import { LandingPage } from "@/features/landing"

export function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-svh flex-col font-sans antialiased text-foreground bg-background">
        <Toaster />
        <a
          href="#main"
          className="sr-only rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60]"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1 overflow-x-clip">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/browse" element={<FindRoommatesPage />} />
            <Route path="/find-roommates" element={<FindRoommatesPage />} />
            <Route path="/sign-in" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/compatibility-test" element={<CompatibilityPage />} />
          </Routes>
        </main>
        <SiteFooter />
      </div>
    </BrowserRouter>
  )
}

export default App
