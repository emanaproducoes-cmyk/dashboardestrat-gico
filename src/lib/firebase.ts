import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDX_ByptNwnUMt-6cq2JnCN0Q0ElVpij9I",
  authDomain: "af-analytics-ffe38.firebaseapp.com",
  projectId: "af-analytics-ffe38",
  storageBucket: "af-analytics-ffe38.firebasestorage.app",
  messagingSenderId: "531209921771",
  appId: "1:531209921771:web:d4ee2da1ca86ad254c8aae",
  measurementId: "G-YCTSS552GK"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
