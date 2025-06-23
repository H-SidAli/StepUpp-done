"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, Globe } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"

interface NavbarProps {
  onAuthClick: (mode: "signin" | "signup") => void
}

export default function Navbar({ onAuthClick }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { language, setLanguage, t, isRTL } = useLanguage()
  const { user, isAuthenticated, logout } = useAuth()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMobileMenuOpen(false)
  }

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en")
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className={`flex-shrink-0 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={`${isRTL ? "ml-3" : "mr-3"}`}>
              <Image src="/logo.jpg" alt="StepUpp Logo" width={45} height={45} className="w-8 h-8 object-contain" />
            </div>
            <Link href="/" className="text-2xl font-bold gradient-text-blue">
              StepUpp
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className={`flex items-baseline space-x-8 ${isRTL ? "space-x-reverse" : ""}`}>
              <button
                onClick={() => scrollToSection("hero")}
                className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t("home")}
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t("services")}
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t("pricing")}
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t("about")}
              </button>
            </div>
          </div>

          {/* Desktop Auth Buttons & Language Switcher */}
          <div className="hidden md:block">
            <div className={`flex items-center space-x-4 ${isRTL ? "space-x-reverse" : ""}`}>
              <button
                onClick={toggleLanguage}
                className={`flex items-center px-2 py-1 rounded transition-colors text-gray-600 hover:text-gray-900 ${
                  isRTL ? "space-x-reverse" : ""
                } space-x-1`}
              >
                <Globe size={16} />
                <span className="text-sm font-medium">{language === "en" ? "العربية" : "English"}</span>
              </button>

              {isAuthenticated ? (
                <div className={`flex items-center space-x-3 ${isRTL ? "space-x-reverse" : ""}`}>
                  <span className="text-sm text-gray-600">Welcome, {user?.firstName || user?.email}</span>
                  <Button
                    variant="outline"
                    onClick={logout}
                    className="bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => onAuthClick("signin")}
                    className="bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    {t("signIn")}
                  </Button>
                  <Button onClick={() => onAuthClick("signup")} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {t("signUp")}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className={`md:hidden flex items-center ${isRTL ? "space-x-reverse" : ""} space-x-2`}>
            <button onClick={toggleLanguage} className="text-gray-900 hover:text-blue-600 p-1">
              <Globe size={20} />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-900 hover:text-blue-600 p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <button
                onClick={() => scrollToSection("hero")}
                className={`block w-full text-gray-900 hover:text-blue-600 px-3 py-2 text-base font-medium ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("home")}
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className={`block w-full text-gray-900 hover:text-blue-600 px-3 py-2 text-base font-medium ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("services")}
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className={`block w-full text-gray-900 hover:text-blue-600 px-3 py-2 text-base font-medium ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("pricing")}
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className={`block w-full text-gray-900 hover:text-blue-600 px-3 py-2 text-base font-medium ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("about")}
              </button>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex flex-col space-y-2">
                  {isAuthenticated ? (
                    <>
                      <span className="text-sm text-gray-600 px-3">Welcome, {user?.firstName || user?.email}</span>
                      <Button
                        variant="outline"
                        onClick={logout}
                        className="bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          onAuthClick("signin")
                          setIsMobileMenuOpen(false)
                        }}
                        className="bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                      >
                        {t("signIn")}
                      </Button>
                      <Button
                        onClick={() => {
                          onAuthClick("signup")
                          setIsMobileMenuOpen(false)
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {t("signUp")}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
