import { useState, useEffect, useCallback } from "react"
import { doc, setDoc, onSnapshot } from "firebase/firestore"
import { db } from "./firebase"

export function useSharedData<T>(
  docId: string,
  initialValue: T
): [T, (value: T) => Promise<void>] {
  const [data, setData] = useState<T | null>(null)

  useEffect(() => {
    const ref = doc(db, "shared_data", docId)
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setData(snap.data().value as T)
      } else {
        setData(initialValue)
      }
    }, () => {
      setData(initialValue)
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

  return [data ?? initialValue, save]
}
