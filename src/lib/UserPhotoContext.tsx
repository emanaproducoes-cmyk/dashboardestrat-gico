import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { doc, onSnapshot, setDoc } from "firebase/firestore"
import { db } from "./firebase"
import { useAuth } from "./AuthContext"

interface UserPhotoContextValue {
  photo: string | null
  savePhoto: (base64: string) => Promise<void>
}

const UserPhotoContext = createContext<UserPhotoContextValue | null>(null)

export function UserPhotoProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [photo, setPhoto] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) return
    const ref = doc(db, "userPhotos", user.id)
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) setPhoto(snap.data().photo || null)
      else setPhoto(null)
    }, () => setPhoto(null))
    return unsub
  }, [user?.id])

  const savePhoto = useCallback(async (base64: string) => {
    if (!user?.id) return
    const ref = doc(db, "userPhotos", user.id)
    await setDoc(ref, { photo: base64 })
    setPhoto(base64)
  }, [user?.id])

  return (
    <UserPhotoContext.Provider value={{ photo, savePhoto }}>
      {children}
    </UserPhotoContext.Provider>
  )
}

export function useUserPhoto() {
  const ctx = useContext(UserPhotoContext)
  if (!ctx) throw new Error("useUserPhoto must be inside UserPhotoProvider")
  return ctx
}
