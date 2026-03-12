import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import {
  signInWithPopup, signOut, onAuthStateChanged,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  updateProfile, type User as FirebaseUser
} from "firebase/auth"
import { auth, googleProvider } from "./firebase"

const ADMIN_EMAIL = "emanaproducoes@gmail.com"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  isAdmin: boolean
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  loginWithGoogle: () => Promise<boolean>
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  registerWithEmail: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function toUser(u: FirebaseUser): User {
  return {
    id: u.uid,
    name: u.displayName || u.email?.split("@")[0] || "Usuário",
    email: u.email || "",
    avatar: u.photoURL || undefined,
    isAdmin: u.email === ADMIN_EMAIL,
  }
}

function parseFirebaseError(code: string): string {
  switch (code) {
    case "auth/user-not-found": return "E-mail não cadastrado."
    case "auth/wrong-password": return "Senha incorreta."
    case "auth/email-already-in-use": return "Este e-mail já está cadastrado."
    case "auth/weak-password": return "A senha deve ter pelo menos 6 caracteres."
    case "auth/invalid-email": return "E-mail inválido."
    case "auth/popup-closed-by-user": return "Login cancelado."
    case "auth/invalid-credential": return "E-mail ou senha incorretos."
    default: return "Erro ao autenticar. Tente novamente."
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ? toUser(u) : null)
      setLoading(false)
    })
    return unsub
  }, [])

  const loginWithGoogle = useCallback(async (): Promise<boolean> => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      if (result.user) { setUser(toUser(result.user)); return true }
      return false
    } catch (e: any) {
      if (e.code === "auth/popup-closed-by-user") return false
      return false
    }
  }, [])

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (e: any) {
      return { success: false, error: parseFirebaseError(e.code) }
    }
  }, [])

  const registerWithEmail = useCallback(async (name: string, email: string, password: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(cred.user, { displayName: name })
      setUser(toUser({ ...cred.user, displayName: name }))
      return { success: true }
    } catch (e: any) {
      return { success: false, error: parseFirebaseError(e.code) }
    }
  }, [])

  const logout = useCallback(async () => { await signOut(auth) }, [])

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithEmail, registerWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be inside AuthProvider")
  return ctx
}
