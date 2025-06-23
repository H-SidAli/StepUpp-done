const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface SignupData {
  email: string
  password: string
  userType: "individual" | "business"
  firstName?: string
  lastName?: string
  phone?: string
  // Individual fields
  experience?: string
  skills?: string
  // Business fields
  companyName?: string
  companySize?: string
  industry?: string
  description?: string
  businessType?: "startup" | "enterprise"
}

export interface SigninData {
  email: string
  password: string
}

export interface ApiResponse<T = any> {
  message?: string
  error?: string
  data?: T
  user?: any
  token?: string
}

// Sign up user
export async function signupUser(data: SignupData): Promise<ApiResponse> {
  try {
    console.log("🚀 Frontend: Sending signup request with data:", {
      email: data.email,
      userType: data.userType,
      hasPassword: !!data.password,
    })

    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    console.log("📡 Frontend: Response status:", response.status)

    const result = await response.json()
    console.log("📡 Frontend: Response data:", result)

    if (!response.ok) {
      throw new Error(result.error || "Signup failed")
    }

    return result
  } catch (error) {
    console.error("❌ Frontend: Signup error:", error)
    throw error
  }
}

// Sign in user
export async function signinUser(data: SigninData): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || "Signin failed")
    }

    // Store token in localStorage
    if (result.token) {
      localStorage.setItem("authToken", result.token)
      localStorage.setItem("user", JSON.stringify(result.user))
    }

    return result
  } catch (error) {
    throw error
  }
}

// Confirm email
export async function confirmEmail(token: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/confirm-email/${token}`, {
      method: "GET",
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || "Email confirmation failed")
    }

    return result
  } catch (error) {
    throw error
  }
}

// Resend confirmation email
export async function resendConfirmation(email: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/resend-confirmation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || "Failed to resend confirmation")
    }

    return result
  } catch (error) {
    throw error
  }
}

// Get user profile
export async function getUserProfile(): Promise<ApiResponse> {
  try {
    const token = localStorage.getItem("authToken")

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || "Failed to get profile")
    }

    return result
  } catch (error) {
    throw error
  }
}

// Logout user
export function logoutUser(): void {
  localStorage.removeItem("authToken")
  localStorage.removeItem("user")
}
