import React, { createContext, useContext, useEffect, useState } from "react"
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth"
import { auth, googleProvider } from "./firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  loginWithGoogle: () => Promise<boolean>
  loginWithEmail: (email: string, password: string) => Promise<boolean>
  registerWithEmail: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      return true
    } catch {
      return false
    }
  }

  const loginWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return true
    } catch {
      return false
    }
  }

  const registerWithEmail = async (email: string, password: string, _name: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      return true
    } catch {
      return false
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithEmail, registerWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
