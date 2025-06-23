"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Building2, Upload, ArrowLeft } from "lucide-react"
import { signupUser, signinUser, resendConfirmation, type SignupData, type SigninData } from "@/lib/api"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "signin" | "signup"
  onModeChange: (mode: "signin" | "signup") => void
}

type SignupStep = "type" | "individual-info" | "individual-cv" | "business-type" | "business-info"

export default function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const [signupStep, setSignupStep] = useState<SignupStep>("type")
  const [userType, setUserType] = useState<"individual" | "business">("individual")
  const [businessType, setBusinessType] = useState<"startup" | "enterprise">("startup")
  const [hasCV, setHasCV] = useState<"yes" | "no">("yes")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    experience: "",
    skills: "",
    companyName: "",
    companySize: "",
    industry: "",
    description: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")

  const handleClose = () => {
    onClose()
    setSignupStep("type")
    setError("")
    setSuccessMessage("")
    setIsLoading(false)
    setFormData({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      experience: "",
      skills: "",
      companyName: "",
      companySize: "",
      industry: "",
      description: "",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSignin = async () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const signinData: SigninData = {
        email: formData.email,
        password: formData.password,
      }

      const result = await signinUser(signinData)
      setSuccessMessage("Sign in successful! Welcome back.")

      // Close modal after short delay
      setTimeout(() => {
        handleClose()
        window.location.reload() // Refresh to update UI
      }, 1500)
    } catch (error: any) {
      setError(error.message || "Sign in failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Validate required fields
      if (!formData.email || !formData.password) {
        setError("Email and password are required")
        setIsLoading(false)
        return
      }

      const signupData: SignupData = {
        email: formData.email,
        password: formData.password,
        userType,
      }

      // Add optional fields only if they have values
      if (formData.firstName) signupData.firstName = formData.firstName
      if (formData.lastName) signupData.lastName = formData.lastName
      if (formData.phone) signupData.phone = formData.phone

      // Add type-specific fields
      if (userType === "individual") {
        if (formData.experience) signupData.experience = formData.experience
        if (formData.skills) signupData.skills = formData.skills
      } else {
        if (formData.companyName) signupData.companyName = formData.companyName
        if (formData.companySize) signupData.companySize = formData.companySize
        if (formData.industry) signupData.industry = formData.industry
        if (formData.description) signupData.description = formData.description
        signupData.businessType = businessType
      }

      console.log("🚀 Frontend: About to send signup data:", signupData)

      const result = await signupUser(signupData)

      console.log("✅ Frontend: Signup successful:", result)

      setSuccessMessage("Registration successful! Please check your email to confirm your account.")

      // Reset form after successful signup
      setTimeout(() => {
        handleClose()
      }, 3000)
    } catch (error: any) {
      console.error("❌ Frontend: Signup failed:", error)
      setError(error.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    if (!formData.email) {
      setError("Please enter your email address")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await resendConfirmation(formData.email)
      setSuccessMessage("Confirmation email sent! Please check your inbox.")
    } catch (error: any) {
      setError(error.message || "Failed to resend confirmation email.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderSignIn = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="signin-email">Email</Label>
        <Input
          id="signin-email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="signin-password">Password</Label>
        <Input
          id="signin-password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
        />
      </div>
      <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSignin} disabled={isLoading}>
        {isLoading ? "Loading..." : "Sign In"}
      </Button>
      <div className="text-center">
        <button onClick={() => onModeChange("signup")} className="text-blue-600 hover:text-blue-700 text-sm">
          Don't have an account? Sign up
        </button>
      </div>
    </div>
  )

  const renderSignupTypeSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Choose your account type</h3>
        <p className="text-gray-600">Select the option that best describes you</p>
      </div>

      <div className="grid gap-4">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${userType === "individual" ? "ring-2 ring-blue-500" : ""}`}
          onClick={() => setUserType("individual")}
        >
          <CardHeader className="text-center">
            <User className="h-12 w-12 text-blue-600 mx-auto mb-2" />
            <CardTitle>Individual</CardTitle>
            <CardDescription>Looking for career opportunities</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${userType === "business" ? "ring-2 ring-green-500" : ""}`}
          onClick={() => setUserType("business")}
        >
          <CardHeader className="text-center">
            <Building2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <CardTitle>Business</CardTitle>
            <CardDescription>Looking to hire talent</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Button
        className="w-full"
        onClick={() => {
          if (userType === "individual") {
            setSignupStep("individual-info")
          } else {
            setSignupStep("business-type")
          }
        }}
      >
        Continue
      </Button>
    </div>
  )

  const renderIndividualInfo = () => (
    <div className="space-y-4">
      <Button variant="ghost" onClick={() => setSignupStep("type")} className="mb-4 p-0 h-auto">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          placeholder="+1 (555) 123-4567"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="password">Password *</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          required
        />
      </div>

      <Button className="w-full" onClick={() => setSignupStep("individual-cv")}>
        Continue
      </Button>
    </div>
  )

  const renderIndividualCV = () => (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => setSignupStep("individual-info")} className="mb-4 p-0 h-auto">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Do you have a CV?</h3>
        <p className="text-gray-600">We can help you create one if you don't</p>
      </div>

      <RadioGroup value={hasCV} onValueChange={(value: "yes" | "no") => setHasCV(value)}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id="has-cv" />
          <Label htmlFor="has-cv">Yes, I have a CV</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id="no-cv" />
          <Label htmlFor="no-cv">No, I need help creating one</Label>
        </div>
      </RadioGroup>

      {hasCV === "yes" ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Upload your CV</p>
          <p className="text-sm text-gray-500 mb-4">PDF, DOC, or DOCX (max 5MB)</p>
          <Button variant="outline">Choose File</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <Label htmlFor="experience">Work Experience</Label>
            <Textarea
              id="experience"
              placeholder="Tell us about your work experience..."
              value={formData.experience}
              onChange={(e) => handleInputChange("experience", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="skills">Skills</Label>
            <Textarea
              id="skills"
              placeholder="List your key skills..."
              value={formData.skills}
              onChange={(e) => handleInputChange("skills", e.target.value)}
            />
          </div>
        </div>
      )}

      <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSignup} disabled={isLoading}>
        {isLoading ? "Loading..." : "Complete Registration"}
      </Button>
    </div>
  )

  const renderBusinessType = () => (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => setSignupStep("type")} className="mb-4 p-0 h-auto">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">What type of business are you?</h3>
        <p className="text-gray-600">This helps us tailor our services to your needs</p>
      </div>

      <div className="grid gap-4">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${businessType === "startup" ? "ring-2 ring-green-500" : ""}`}
          onClick={() => setBusinessType("startup")}
        >
          <CardHeader className="text-center">
            <CardTitle>Startup</CardTitle>
            <CardDescription>Early-stage company looking to grow</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${businessType === "enterprise" ? "ring-2 ring-green-500" : ""}`}
          onClick={() => setBusinessType("enterprise")}
        >
          <CardHeader className="text-center">
            <CardTitle>Enterprise</CardTitle>
            <CardDescription>Established company with structured hiring</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Button className="w-full" onClick={() => setSignupStep("business-info")}>
        Continue
      </Button>
    </div>
  )

  const renderBusinessInfo = () => (
    <div className="space-y-4">
      <Button variant="ghost" onClick={() => setSignupStep("business-type")} className="mb-4 p-0 h-auto">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div>
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          placeholder="Your Company Inc."
          value={formData.companyName}
          onChange={(e) => handleInputChange("companyName", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="email">Business Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="contact@yourcompany.com"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="companySize">Company Size</Label>
        <Input
          id="companySize"
          placeholder="e.g., 10-50 employees"
          value={formData.companySize}
          onChange={(e) => handleInputChange("companySize", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="industry">Industry</Label>
        <Input
          id="industry"
          placeholder="e.g., Technology, Healthcare"
          value={formData.industry}
          onChange={(e) => handleInputChange("industry", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="description">Company Description</Label>
        <Textarea
          id="description"
          placeholder="Tell us about your company..."
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="password">Password *</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          required
        />
      </div>

      <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleSignup} disabled={isLoading}>
        {isLoading ? "Loading..." : "Complete Registration"}
      </Button>
    </div>
  )

  const renderContent = () => {
    if (mode === "signin") {
      return renderSignIn()
    }

    switch (signupStep) {
      case "type":
        return renderSignupTypeSelection()
      case "individual-info":
        return renderIndividualInfo()
      case "individual-cv":
        return renderIndividualCV()
      case "business-type":
        return renderBusinessType()
      case "business-info":
        return renderBusinessInfo()
      default:
        return renderSignupTypeSelection()
    }
  }

  const getTitle = () => {
    if (mode === "signin") return "Sign In"

    switch (signupStep) {
      case "type":
        return "Create Account"
      case "individual-info":
        return "Personal Information"
      case "individual-cv":
        return "CV Information"
      case "business-type":
        return "Business Type"
      case "business-info":
        return "Business Information"
      default:
        return "Create Account"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">{getTitle()}</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {/* Error and Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
              {error.includes("confirm your email") && (
                <button
                  onClick={handleResendConfirmation}
                  className="text-red-700 underline text-sm mt-1 hover:text-red-800"
                  disabled={isLoading}
                >
                  Resend confirmation email
                </button>
              )}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Form Content */}
          {renderContent()}
        </div>

        {mode === "signup" && signupStep === "type" && (
          <div className="text-center mt-4">
            <button onClick={() => onModeChange("signin")} className="text-blue-600 hover:text-blue-700 text-sm">
              Already have an account? Sign in
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
