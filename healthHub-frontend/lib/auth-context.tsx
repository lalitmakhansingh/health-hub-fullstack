"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { apiFetch } from "./api"

type User = { id: string; firstName: string; lastName: string; email: string } | null

type AuthContextType = {
  user: User
  checkedAuth: boolean
  refetch: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [checkedAuth, setCheckedAuth] = useState(false)

  const refetch = async () => {
    try {
      const { user } = await apiFetch("/api/auth/me")
      setUser(user)
    } catch {
      setUser(null)
    } finally {
      setCheckedAuth(true)
    }
  }

  useEffect(() => {
    refetch()
  }, [])

  const logout = async () => {
    await apiFetch("/api/auth/logout", { method: "POST" })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, checkedAuth, refetch, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}