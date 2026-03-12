export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "viewer"
  avatar?: string
}

const SESSION_KEY = "af_session"
const USERS_KEY = "af_registered_users"

const DEFAULT_ADMIN = {
  id: "user_af_admin",
  name: "AF Admin",
  email: "admin@afconsultoria.com",
  role: "admin" as const,
  passwordHash: btoa("af2026"),
}

function getRegisteredUsers(): (User & { passwordHash: string })[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    const saved = raw ? JSON.parse(raw) : []
    const hasAdmin = saved.some((u: User) => u.email === DEFAULT_ADMIN.email)
    if (!hasAdmin) saved.unshift(DEFAULT_ADMIN)
    return saved
  } catch {
    return [DEFAULT_ADMIN]
  }
}

function saveRegisteredUsers(users: (User & { passwordHash: string })[]): void {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)) } catch {}
}

export function login(email: string, password: string): User | null {
  const users = getRegisteredUsers()
  const found = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() &&
         u.passwordHash === btoa(password)
  )
  if (!found) return null
  const { passwordHash: _, ...user } = found
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(user)) } catch {}
  return user
}

export function register(name: string, email: string, password: string): { success: boolean; error?: string } {
  const users = getRegisteredUsers()
  const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase())
  if (exists) return { success: false, error: "Este e-mail já está cadastrado." }
  if (password.length < 6) return { success: false, error: "A senha deve ter pelo menos 6 caracteres." }

  const newUser: User & { passwordHash: string } = {
    id: `user_${Date.now()}`,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    role: "viewer",
    passwordHash: btoa(password),
  }
  users.push(newUser)
  saveRegisteredUsers(users)

  const { passwordHash: _, ...user } = newUser
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(user)) } catch {}
  return { success: true }
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

export function userKey(userId: string, key: string): string {
  return `af_u_${userId}_${key}`
}

export function getUserItem(userId: string, key: string): string | null {
  try { return localStorage.getItem(userKey(userId, key)) } catch { return null }
}

export function setUserItem(userId: string, key: string, value: string): void {
  try { localStorage.setItem(userKey(userId, key), value) } catch {}
}
