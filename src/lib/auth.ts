import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider
} from "firebase/auth"
import { auth, googleProvider } from "./firebase"

export async function loginWithGoogle() {
  try {
    await signInWithPopup(auth, googleProvider)
    return true
  } catch {
    return false
  }
}

export async function loginWithEmail(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password)
    return true
  } catch {
    return false
  }
}

export async function registerWithEmail(email: string, password: string) {
  try {
    await createUserWithEmailAndPassword(auth, email, password)
    return true
  } catch {
    return false
  }
}

export async function logout() {
  await signOut(auth)
}
