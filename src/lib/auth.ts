// Auth legacy - substituído pelo Firebase Authentication
// Mantido apenas para compatibilidade com getUserItem/setUserItem

export function userKey(userId: string, key: string): string {
  return `af_u_${userId}_${key}`
}

export function getUserItem(userId: string, key: string): string | null {
  try { return localStorage.getItem(userKey(userId, key)) } catch { return null }
}

export function setUserItem(userId: string, key: string, value: string): void {
  try { localStorage.setItem(userKey(userId, key), value) } catch {}
}
