'use client'

/**
 * useCalendarTokens — Manages OAuth tokens encrypted with EncryptID.
 *
 * Tokens are encrypted client-side using the user's passkey-derived AES-256-GCM
 * key and stored in localStorage. The server never persists tokens.
 *
 * Storage format per provider in localStorage:
 *   rcal_oauth_{provider} = JSON { ciphertext: base64, iv: base64 }
 *
 * Decrypted payload:
 *   { access_token, refresh_token, expires_at, calendars }
 */

import { useState, useCallback } from 'react'
import {
  getKeyManager,
  encryptData,
  decryptDataAsString,
  bufferToBase64url,
  base64urlToBuffer,
} from '@encryptid/sdk/client'

const STORAGE_PREFIX = 'rcal_oauth_'

export interface StoredCalendarTokens {
  provider: string
  access_token: string
  refresh_token?: string
  expires_at: number // Unix ms
  calendars: Array<{
    id: string
    name: string
    color?: string
    primary?: boolean
  }>
}

interface EncryptedBlob {
  ciphertext: string // base64url
  iv: string // base64url
}

/**
 * Encrypt OAuth tokens with the user's EncryptID key and store in localStorage.
 */
export async function encryptAndStoreTokens(
  provider: string,
  tokens: {
    access_token: string
    refresh_token?: string
    expires_in: number
    calendars: Array<{ id: string; name: string; color?: string; primary?: boolean }>
  }
): Promise<void> {
  const km = getKeyManager()
  if (!km.isInitialized()) {
    throw new Error('EncryptID key manager not initialized — please sign in with your passkey')
  }

  const keys = await km.getKeys()

  const payload: StoredCalendarTokens = {
    provider,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: Date.now() + tokens.expires_in * 1000,
    calendars: tokens.calendars,
  }

  const encrypted = await encryptData(keys.encryptionKey, JSON.stringify(payload))

  const blob: EncryptedBlob = {
    ciphertext: bufferToBase64url(encrypted.ciphertext),
    iv: bufferToBase64url(encrypted.iv.buffer as ArrayBuffer),
  }

  localStorage.setItem(`${STORAGE_PREFIX}${provider}`, JSON.stringify(blob))
}

/**
 * Decrypt stored tokens for a provider.
 */
export async function decryptStoredTokens(provider: string): Promise<StoredCalendarTokens | null> {
  const stored = localStorage.getItem(`${STORAGE_PREFIX}${provider}`)
  if (!stored) return null

  const km = getKeyManager()
  if (!km.isInitialized()) return null

  try {
    const keys = await km.getKeys()
    const blob: EncryptedBlob = JSON.parse(stored)

    const decrypted = await decryptDataAsString(keys.encryptionKey, {
      ciphertext: base64urlToBuffer(blob.ciphertext),
      iv: new Uint8Array(base64urlToBuffer(blob.iv)),
    })

    return JSON.parse(decrypted) as StoredCalendarTokens
  } catch (err) {
    console.error(`Failed to decrypt ${provider} tokens:`, err)
    return null
  }
}

/**
 * Remove stored tokens for a provider.
 */
export function removeStoredTokens(provider: string): void {
  localStorage.removeItem(`${STORAGE_PREFIX}${provider}`)
}

/**
 * Check which providers have stored (encrypted) tokens.
 */
export function getConnectedProviders(): string[] {
  const providers: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(STORAGE_PREFIX)) {
      providers.push(key.slice(STORAGE_PREFIX.length))
    }
  }
  return providers
}

/**
 * Refresh an expired access token via the server.
 * Decrypts refresh_token, sends to server, gets new access_token,
 * re-encrypts and stores the updated tokens.
 */
export async function refreshAndUpdateTokens(provider: string): Promise<StoredCalendarTokens | null> {
  const tokens = await decryptStoredTokens(provider)
  if (!tokens?.refresh_token) return null

  try {
    const response = await fetch(`/api/auth/${provider}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: tokens.refresh_token }),
    })

    if (!response.ok) {
      if (response.status === 401) {
        // Refresh token revoked — remove stored tokens
        removeStoredTokens(provider)
        return null
      }
      throw new Error(`Refresh failed: ${response.status}`)
    }

    const result = await response.json()

    // Re-encrypt with updated access token
    await encryptAndStoreTokens(provider, {
      access_token: result.access_token,
      refresh_token: tokens.refresh_token, // Keep existing refresh token
      expires_in: result.expires_in,
      calendars: tokens.calendars,
    })

    return await decryptStoredTokens(provider)
  } catch (err) {
    console.error(`Failed to refresh ${provider} token:`, err)
    return null
  }
}

/**
 * Get a valid access token, refreshing if expired.
 */
export async function getValidAccessToken(provider: string): Promise<string | null> {
  let tokens = await decryptStoredTokens(provider)
  if (!tokens) return null

  // If token expires within 2 minutes, refresh
  if (tokens.expires_at < Date.now() + 120_000) {
    tokens = await refreshAndUpdateTokens(provider)
    if (!tokens) return null
  }

  return tokens.access_token
}

/**
 * React hook for calendar token state.
 */
export function useCalendarTokens() {
  const [connectedProviders, setConnectedProviders] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    return getConnectedProviders()
  })

  const refresh = useCallback(() => {
    setConnectedProviders(getConnectedProviders())
  }, [])

  const disconnect = useCallback((provider: string) => {
    removeStoredTokens(provider)
    setConnectedProviders(getConnectedProviders())
  }, [])

  return {
    connectedProviders,
    hasConnected: connectedProviders.length > 0,
    refresh,
    disconnect,
  }
}
