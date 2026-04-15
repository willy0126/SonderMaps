import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { SonderSection } from "@/components/landing/sonder-section"
import { ExploreSection } from "@/components/landing/explore-section"
import { ResonanceSection } from "@/components/landing/resonance-section"
import { CtaSection } from "@/components/landing/cta-section"
import { ScrollToTop } from "@/components/landing/scroll-to-top"

export default function HomePage() {
  return (
    <main className="noise-overlay">
      <Navbar />
      <HeroSection />
      <SonderSection />
      <ExploreSection />
      <ResonanceSection />
      <CtaSection />
      <ScrollToTop />
    </main>
  )
}
