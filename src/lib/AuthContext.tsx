import React, { createContext, useContext, useState, useCallback } from "react"
import { type User, login as doLogin, logout as doLogout, register as doRegister, getSession } from "./auth"

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => boolean
  register: (name: string, email: string, password: string) => { success: boolean; error?: string }
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getSession())

  const login = useCallback((email: string, password: string): boolean => {
    const u = doLogin(email, password)
    if (u) { setUser(u); return true }
    return false
  }, [])

  const register = useCallback((name: string, email: string, password: string) => {
    const result = doRegister(name, email, password)
    if (result.success) {
      const u = getSession()
      if (u) setUser(u)
    }
    return result
  }, [])

  const logout = useCallback(() => {
    doLogout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be inside AuthProvider")
  return ctx
}
