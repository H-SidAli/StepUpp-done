"use client"

import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function AboutSection() {
  const { t, isRTL } = useLanguage()

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("aboutTitle")}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("aboutDescription")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <div className="bg-white rounded-lg p-8 shadow-lg hover-lift">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div
                  className={`w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg ${isRTL ? "ml-3" : "mr-3"}`}
                ></div>
                {t("getInTouch")}
              </h3>
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-center group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div className={`flex-1 ${isRTL ? "mr-4 text-right" : "ml-4 text-left"}`}>
                    <p className="font-semibold text-gray-900">{t("email")}</p>
                    <p className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                      stepupp25@gmail.com
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div className={`flex-1 ${isRTL ? "mr-4 text-right" : "ml-4 text-left"}`}>
                    <p className="font-semibold text-gray-900">{t("phone")}</p>
                    <p className="text-gray-600 hover:text-green-600 transition-colors cursor-pointer">
                      {isRTL ? "+213 698 08 26 49" : "+213 698 08 26 49"}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div className={`flex-1 ${isRTL ? "mr-4 text-right" : "ml-4 text-left"}`}>
                    <p className="font-semibold text-gray-900">{t("address")}</p>
                    <p className="text-gray-600">
                      {isRTL ? (
                        <>
                          جامعة الجلفة
                          <br />
                          الجلفة، الجزائر
                        </>
                      ) : (
                        <>
                          University of Djelfa
                          <br />
                          Djelfa, Algeria
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <div className="bg-white rounded-lg p-8 shadow-lg hover-lift">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div
                  className={`w-8 h-8 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg ${isRTL ? "ml-3" : "mr-3"}`}
                ></div>
                {t("followUs")}
              </h3>
              <p className={`text-gray-600 mb-8 leading-relaxed ${isRTL ? "text-right" : "text-left"}`}>
                {t("followUsDesc")}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="#"
                  className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3"
                  aria-label="Facebook"
                >
                  <Facebook className="h-6 w-6" />
                  <span className="font-medium">Facebook</span>
                </a>
                <a
                  href="#"
                  className="group bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3"
                  aria-label="Twitter"
                >
                  <Twitter className="h-6 w-6" />
                  <span className="font-medium">Twitter</span>
                </a>
                <a
                  href="#"
                  className="group bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-6 w-6" />
                  <span className="font-medium">LinkedIn</span>
                </a>
                <a
                  href="#"
                  className="group bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3"
                  aria-label="Instagram"
                >
                  <Instagram className="h-6 w-6" />
                  <span className="font-medium">Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600 bg-white rounded-lg px-6 py-3 inline-block shadow-sm">{t("footerText")}</p>
        </div>
      </div>
    </section>
  )
}
