"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

interface User {
  id: number
  username: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, userData: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Initial check for persisted session
    const storedToken = localStorage.getItem("adwise_token")
    if (storedToken) {
      setToken(storedToken)
      fetchProfile()
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await api.get("/accounts/profile/")
      setUser(res.data)
    } catch (err) {
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  const login = (newToken: string, userData: User) => {
    localStorage.setItem("adwise_token", newToken)
    setToken(newToken)
    setUser(userData)
    router.push("/dashboard")
  }

  const logout = () => {
    localStorage.removeItem("adwise_token")
    setToken(null)
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
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
