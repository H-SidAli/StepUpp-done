"use client"

import { useLanguage } from "@/contexts/language-context"
import { Play, ArrowRight, ArrowLeft } from "lucide-react"

export default function HeroSection() {
  const { t, isRTL } = useLanguage()

  return (
    <section id="hero" className="pt-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <div className={`order-1 ${isRTL ? "text-right" : "text-left"}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {t("heroTitle")}
              <span className="block gradient-text-blue">{t("heroTitleHighlight")}</span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed mb-8">{t("heroDescription")}</p>

            <div className={`flex flex-col sm:flex-row gap-4 ${isRTL ? "sm:flex-row-reverse" : ""}`}>
              <button
                className={`bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-xl flex items-center justify-center ${
                  isRTL ? "space-x-reverse" : ""
                } space-x-2`}
              >
                <span>{t("getStarted")}</span>
                {isRTL ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
              </button>
              <button
                className={`border-2 border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-blue-50 flex items-center justify-center ${
                  isRTL ? "space-x-reverse" : ""
                } space-x-2`}
              >
                <Play className="h-5 w-5" />
                <span>{t("learnMore")}</span>
              </button>
            </div>
          </div>

          {/* Video Section */}
          <div className="order-2">
            <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-2xl hover-lift group">
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                controls
                poster="/placeholder.svg?height=400&width=600"
              >
                <source src="/intro.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Custom Controls Overlay */}
              {/* <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button className="text-white hover:text-blue-400 transition-colors">
                        <Play className="h-5 w-5" />
                      </button>
                      <div className="flex-1 bg-white/20 rounded-full h-1 mx-3">
                        <div className="bg-blue-500 h-1 rounded-full w-1/3"></div>
                      </div>
                      <span className="text-white text-sm">0:30 / 1:30</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-white hover:text-blue-400 transition-colors">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-1.594-.471-3.078-1.343-4.243a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                          <path
                            fillRule="evenodd"
                            d="M13.828 7.172a1 1 0 011.414 0A5.983 5.983 0 0117 12a5.983 5.983 0 01-1.758 4.828 1 1 0 11-1.414-1.414A3.987 3.987 0 0015 12a3.987 3.987 0 00-1.172-2.828 1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <button className="text-white hover:text-blue-400 transition-colors">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
