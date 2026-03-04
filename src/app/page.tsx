import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { SonderSection } from "@/components/landing/sonder-section"
import { ExploreSection } from "@/components/landing/explore-section"
import { ResonanceSection } from "@/components/landing/resonance-section"
import { CtaSection } from "@/components/landing/cta-section"

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <SonderSection />
      <ExploreSection />
      <ResonanceSection />
      <CtaSection />
    </main>
  )
}
