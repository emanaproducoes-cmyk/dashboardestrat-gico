import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { doc, onSnapshot, setDoc } from "firebase/firestore"
import { db } from "./firebase"

export type TextAlign = "left" | "center" | "right" | "justify"

export interface FontSettings {
  titulo: { size: number; align: TextAlign }
  subtitulo1: { size: number; align: TextAlign }
  subtitulo2: { size: number; align: TextAlign }
}

export const DEFAULT_FONT_SETTINGS: FontSettings = {
  titulo:     { size: 32, align: "left" },
  subtitulo1: { size: 20, align: "left" },
  subtitulo2: { size: 14, align: "left" },
}

interface FontSettingsContextValue {
  fontSettings: FontSettings
  saveFontSettings: (settings: FontSettings) => Promise<void>
  loading: boolean
}

const FontSettingsContext = createContext<FontSettingsContextValue | null>(null)

export function FontSettingsProvider({ children }: { children: React.ReactNode }) {
  const [fontSettings, setFontSettings] = useState<FontSettings>(DEFAULT_FONT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ref = doc(db, "settings", "fontSettings")
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setFontSettings({ ...DEFAULT_FONT_SETTINGS, ...snap.data() as FontSettings })
      }
      setLoading(false)
    }, () => setLoading(false))
    return unsub
  }, [])

  const saveFontSettings = useCallback(async (settings: FontSettings) => {
    const ref = doc(db, "settings", "fontSettings")
    await setDoc(ref, settings)
  }, [])

  return (
    <FontSettingsContext.Provider value={{ fontSettings, saveFontSettings, loading }}>
      {children}
    </FontSettingsContext.Provider>
  )
}

export function useFontSettings() {
  const ctx = useContext(FontSettingsContext)
  if (!ctx) throw new Error("useFontSettings must be inside FontSettingsProvider")
  return ctx
}
