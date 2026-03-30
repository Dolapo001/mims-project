"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

import { User } from "@/types"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, name?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Mock checking for session on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("auth_user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (e) {
      console.error("Failed to parse auth user", e)
      localStorage.removeItem("auth_user")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, name?: string) => {
    setIsLoading(true)
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const mockUser = { id: "1", email, name: name || email.split("@")[0] }
    setUser(mockUser)
    localStorage.setItem("auth_user", JSON.stringify(mockUser))
    setIsLoading(false)
    router.replace("/dashboard")
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth_user")
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
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
