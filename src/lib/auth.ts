// ─── Auth types ────────────────────────────────────────────────────
export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "viewer"
  avatar?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// ─── Pre-registered users (senha: hash simples base64) ─────────────
// Para adicionar usuários: { id, name, email, role, passwordHash }
// passwordHash = btoa(password)
const USERS: (User & { passwordHash: string })[] = [
  {
    id: "user_af_admin",
    name: "AF Admin",
    email: "admin@afconsultoria.com",
    role: "admin",
    passwordHash: btoa("af2026"),
  },
  {
    id: "user_af_viewer",
    name: "Visitante AF",
    email: "visitante@afconsultoria.com",
    role: "viewer",
    passwordHash: btoa("af2026"),
  },
]

const SESSION_KEY = "af_session"

// ─── Auth functions ─────────────────────────────────────────────────
export function login(email: string, password: string): User | null {
  const found = USERS.find(
    u => u.email.toLowerCase() === email.toLowerCase() &&
         u.passwordHash === btoa(password)
  )
  if (!found) return null
  const { passwordHash: _, ...user } = found
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(user)) } catch {}
  return user
}

export function logout(): void {
  try { localStorage.removeItem(SESSION_KEY) } catch {}
}

export function getSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as User
  } catch { return null }
}

// ─── Per-user storage key prefix ────────────────────────────────────
export function userKey(userId: string, key: string): string {
  return `af_u_${userId}_${key}`
}

export function getUserItem(userId: string, key: string): string | null {
  try { return localStorage.getItem(userKey(userId, key)) } catch { return null }
}

export function setUserItem(userId: string, key: string, value: string): void {
  try { localStorage.setItem(userKey(userId, key), value) } catch {}
}
