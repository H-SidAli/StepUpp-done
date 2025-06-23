"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { confirmEmail } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function ConfirmEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    const handleConfirmation = async () => {
      if (!token) {
        setStatus("error")
        setMessage("Invalid confirmation link")
        return
      }

      try {
        const result = await confirmEmail(token)
        setStatus("success")
        setMessage(result.message || "Email confirmed successfully!")
      } catch (error: any) {
        setStatus("error")
        setMessage(error.message || "Email confirmation failed")
      }
    }

    handleConfirmation()
  }, [token])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirming Email</h1>
            <p className="text-gray-600">Please wait while we confirm your email address...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Confirmed!</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Go to Homepage</Button>
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirmation Failed</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Go to Homepage
                </Button>
              </Link>
              <p className="text-sm text-gray-500">
                Need help? Contact support at{" "}
                <a href="mailto:support@stepupp.com" className="text-blue-600 hover:underline">
                  support@stepupp.com
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
