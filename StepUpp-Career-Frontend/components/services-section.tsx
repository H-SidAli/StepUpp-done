"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Building2, FileText, Briefcase, Users, TrendingUp, Shield, Zap } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function ServicesSection() {
  const [activeTab, setActiveTab] = useState<"individual" | "business">("individual")
  const { t, isRTL } = useLanguage()

  const individualServices = [
    {
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      title: t("cvBuilder"),
      description: t("cvBuilderDesc"),
    },
    {
      icon: <Briefcase className="h-8 w-8 text-blue-600" />,
      title: t("jobMatching"),
      description: t("jobMatchingDesc"),
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      title: t("careerGrowth"),
      description: t("careerGrowthDesc"),
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: t("profileProtection"),
      description: t("profileProtectionDesc"),
    },
  ]

  const businessServices = [
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: t("talentAcquisition"),
      description: t("talentAcquisitionDesc"),
    },
    {
      icon: <Building2 className="h-8 w-8 text-green-600" />,
      title: t("companyBranding"),
      description: t("companyBrandingDesc"),
    },
    {
      icon: <Zap className="h-8 w-8 text-green-600" />,
      title: t("fastHiring"),
      description: t("fastHiringDesc"),
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      title: t("growthSolutions"),
      description: t("growthSolutionsDesc"),
    },
  ]

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 ${isRTL ? "text-right" : "text-left"} md:text-center`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("servicesTitle")}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("servicesDescription")}</p>
        </div>

        {/* Toggle Switch */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button
              onClick={() => setActiveTab("individual")}
              className={`px-6 py-3 rounded-md font-semibold transition-all flex items-center ${
                isRTL ? "space-x-reverse" : ""
              } space-x-2 ${
                activeTab === "individual" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <User className="w-5 h-5" />
              <span>{t("individual")}</span>
            </button>
            <button
              onClick={() => setActiveTab("business")}
              className={`px-6 py-3 rounded-md font-semibold transition-all flex items-center ${
                isRTL ? "space-x-reverse" : ""
              } space-x-2 ${
                activeTab === "business" ? "bg-white text-green-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span>{t("business")}</span>
            </button>
          </div>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(activeTab === "individual" ? individualServices : businessServices).map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 hover-lift">
              <CardHeader className={`text-center ${isRTL ? "text-right" : "text-left"} md:text-center`}>
                <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-full w-fit">{service.icon}</div>
                <CardTitle className="text-xl font-semibold">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription
                  className={`text-center text-gray-600 ${isRTL ? "text-right" : "text-left"} md:text-center`}
                >
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
