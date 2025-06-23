"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Building2, Check } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function PricingSection() {
  const [activeTab, setActiveTab] = useState<"individual" | "business">("individual")
  const { t, isRTL } = useLanguage()

  const individualPlans = [
    {
      name: t("basicPlan"),
      price: t("basicPrice"),
      description: t("basicDesc"),
      features: [t("basicFeature1"), t("basicFeature2"), t("basicFeature3"), t("basicFeature4")],
      popular: false,
    },
    {
      name: t("standardPlan"),
      price: t("standardPrice"),
      description: t("standardDesc"),
      features: [t("standardFeature1"), t("standardFeature2"), t("standardFeature3"), t("standardFeature4")],
      popular: true,
    },
    {
      name: t("proPlan"),
      price: t("proPrice"),
      description: t("proDesc"),
      features: [t("proFeature1"), t("proFeature2"), t("proFeature3")],
      popular: false,
    },
    {
      name: t("premiumPlan"),
      price: t("premiumPrice"),
      description: t("premiumDesc"),
      features: [t("premiumFeature1"), t("premiumFeature2"), t("premiumFeature3"), t("premiumFeature4")],
      popular: false,
    },
  ]

  const businessPlans = [
    {
      name: t("starterPlan"),
      price: t("starterPrice"),
      description: t("starterPlanDesc"),
      features: [t("starterFeature1"), t("starterFeature2"), t("starterFeature3"), t("starterFeature4")],
      popular: false,
    },
    {
      name: t("growthPlan"),
      price: t("growthPrice"),
      description: t("growthPlanDesc"),
      features: [t("growthFeature1"), t("growthFeature2"), t("growthFeature3"), t("growthFeature4")],
      popular: true,
    },
    {
      name: t("scalePlan"),
      price: t("scalePrice"),
      description: t("scalePlanDesc"),
      features: [t("scaleFeature1"), t("scaleFeature2"), t("scaleFeature3"), t("scaleFeature4")],
      popular: false,
    },
    {
      name: t("enterprisePlan"),
      price: t("enterprisePrice"),
      description: t("enterprisePlanDesc"),
      features: [t("enterpriseFeature1"), t("enterpriseFeature2"), t("enterpriseFeature3"), t("enterpriseFeature4")],
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 ${isRTL ? "text-right" : "text-left"} md:text-center`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("pricingTitle")}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("pricingDescription")}</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-lg flex shadow-sm">
            <button
              onClick={() => setActiveTab("individual")}
              className={`px-6 py-3 rounded-md font-semibold transition-all flex items-center ${
                isRTL ? "space-x-reverse" : ""
              } space-x-2 ${
                activeTab === "individual" ? "bg-blue-100 text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
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
                activeTab === "business" ? "bg-green-100 text-green-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span>{t("business")}</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(activeTab === "individual" ? individualPlans : businessPlans).map((plan, index) => (
            <Card
              key={index}
              className={`relative hover:shadow-xl transition-all duration-300 hover-lift ${
                plan.popular ? "ring-2 ring-blue-500 scale-105" : ""
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                  {t("mostPopular")}
                </Badge>
              )}
              <CardHeader className={`text-center pb-4 ${isRTL ? "text-right" : "text-left"} md:text-center`}>
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.price !== t("enterprisePrice") && (
                    <span className="text-gray-600">/{t("monthly").toLowerCase()}</span>
                  )}
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className={`flex items-start ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                      <Check
                        className={`h-5 w-5 text-green-500 ${isRTL ? "ml-3 mt-0.5" : "mr-3 mt-0.5"} flex-shrink-0`}
                      />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    activeTab === "individual" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
                  } text-white`}
                >
                  {t("getStartedBtn")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
