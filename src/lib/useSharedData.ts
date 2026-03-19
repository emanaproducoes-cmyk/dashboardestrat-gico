import { useState, useEffect, useCallback } from "react"
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore"
import { db } from "./firebase"

// Salva e lê dados do Firestore em tempo real
// Todos os usuários veem as mesmas alterações feitas pelo admin
export function useSharedData<T>(
  docId: string,
  initialValue: T
): [T, (value: T) => Promise<void>, boolean] {
  const [data, setData]       = useState<T>(initialValue)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ref = doc(db, "shared_data", docId)
    // Escuta mudanças em tempo real
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setData(snap.data().value as T)
      }
      setLoading(false)
    }, () => {
      setLoading(false)
    })
    return unsub
  }, [docId])

  const save = useCallback(async (value: T) => {
    try {
      const ref = doc(db, "shared_data", docId)
      await setDoc(ref, { value, updatedAt: new Date().toISOString() })
      setData(value)
    } catch (e) {
      console.error("Erro ao salvar:", e)
    }
  }, [docId])

  return [data, save, loading]
}
