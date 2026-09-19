import { Container } from "@/components/layout/container"
import { FinalCtaSection } from "@/features/landing/components/final-cta-section"
import { HeroSection } from "@/features/landing/components/hero-section"
import { JourneySection } from "@/features/landing/components/journey-section"
import { LifestyleSearchBar } from "@/features/landing/components/lifestyle-search-bar"
import { LivingHabitsSection } from "@/features/landing/components/living-habits-section"

function LandingPage() {
  return (
    <Container className="flex flex-col gap-[4.5rem] pt-8 pb-8">
      <div className="flex flex-col gap-8">
        <LifestyleSearchBar />
        <HeroSection />
      </div>
      <LivingHabitsSection />
      <JourneySection />
      <FinalCtaSection />
    </Container>
  )
}

export { LandingPage }
