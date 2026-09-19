import { Container } from "@/components/layout/container"
import { FinalCtaSection } from "@/features/landingpage/components/final-cta-section"
import { HeroSection } from "@/features/landingpage/components/hero-section"
import { JourneySection } from "@/features/landingpage/components/journey-section"
import { LivingHabitsSection } from "@/features/landingpage/components/living-habits-section"
import { FeaturedListingsSection } from "@/features/landingpage/components/featured-listings-section"
import { LifestyleSearchBar } from "@/features/landingpage/components/lifestyle-search-bar"

function LandingPage() {
  return (
    <Container className="flex flex-col gap-20 pt-8 pb-12 lg:gap-28 lg:pt-10 lg:pb-16">
      <div className="flex flex-col gap-8 lg:gap-10">
        <LifestyleSearchBar />
        <HeroSection />
      </div>
      <FeaturedListingsSection />
      <LivingHabitsSection />
      <JourneySection />
      <FinalCtaSection />
    </Container>
  )
}

export { LandingPage }
