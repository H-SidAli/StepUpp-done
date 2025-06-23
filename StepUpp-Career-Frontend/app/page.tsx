"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import ServicesSection from "@/components/services-section"
import AboutSection from "@/components/about-section"
import AuthModal from "@/components/auth-modal"
import { useLanguage } from "@/contexts/language-context"
import PricingSection from "@/components/pricing-section"

export default function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")
  const { isRTL } = useLanguage()

  const handleAuthClick = (mode: "signin" | "signup") => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  return (
    <div className={`min-h-screen bg-white ${isRTL ? "rtl" : "ltr"}`}>
      <Navbar onAuthClick={handleAuthClick} />

      <main>
        <HeroSection />
        <ServicesSection />
        <PricingSection />
        <AboutSection />
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  )
}
