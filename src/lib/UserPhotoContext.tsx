import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { doc, onSnapshot, setDoc } from "firebase/firestore"
import { db } from "./firebase"
import { useAuth } from "./AuthContext"

interface UserPhotoContextValue {
  photo: string | null
  savePhoto: (base64: string) => Promise<void>
}

const UserPhotoContext = createContext<UserPhotoContextValue | null>(null)

function compressImage(base64: string, maxSize = 200): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ratio = Math.min(maxSize / img.width, maxSize / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL("image/jpeg", 0.7))
    }
    img.src = base64
  })
}

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
    const compressed = await compressImage(base64)
    const ref = doc(db, "userPhotos", user.id)
    await setDoc(ref, { photo: compressed })
    setPhoto(compressed)
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
