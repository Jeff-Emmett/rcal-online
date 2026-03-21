/**
 * Temporary in-memory store for OAuth tokens pending client retrieval.
 * Tokens live here for max 60 seconds before being picked up by the client,
 * encrypted with EncryptID, and stored in the browser.
 * NOT persisted — lives only in this server process's memory.
 */

const pendingTokens = new Map<string, { data: unknown; expiresAt: number }>()

// Cleanup expired entries periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    pendingTokens.forEach((entry, key) => {
      if (now > entry.expiresAt) pendingTokens.delete(key)
    })
  }, 10_000)
}

export function storePendingToken(code: string, data: unknown, ttlMs = 60_000): void {
  pendingTokens.set(code, {
    data,
    expiresAt: Date.now() + ttlMs,
  })
}

/**
 * One-time retrieval — deletes the token after reading.
 */
export function getPendingToken(code: string): unknown | null {
  const entry = pendingTokens.get(code)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    pendingTokens.delete(code)
    return null
  }
  pendingTokens.delete(code)
  return entry.data
}
