const GLOBAL_PREFIX = "af_global_"

export function getGlobalItem(key: string): string | null {
  try { return localStorage.getItem(GLOBAL_PREFIX + key) } catch { return null }
}

export function setGlobalItem(key: string, value: string): void {
  try { localStorage.setItem(GLOBAL_PREFIX + key, value) } catch {}
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
