"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getUserProfile, logoutUser } from "@/lib/api"

interface User {
  id: string
  email: string
  userType: "individual" | "business"
  firstName?: string
  lastName?: string
  emailConfirmed: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const result = await getUserProfile()
      setUser(result.user)
    } catch (error) {
      // Token might be invalid, clear it
      logoutUser()
      setUser(null)
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("authToken")
      if (token) {
        await refreshUser()
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const logout = () => {
    logoutUser()
    setUser(null)
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
