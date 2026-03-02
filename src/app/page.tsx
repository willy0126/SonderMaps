import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { SonderSection } from "@/components/landing/sonder-section"

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <SonderSection />
    </main>
  )
}
