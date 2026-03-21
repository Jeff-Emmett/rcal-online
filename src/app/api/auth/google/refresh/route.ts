import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, isAuthed } from '@/lib/auth'
import { refreshGoogleToken } from '@/lib/oauth'

/**
 * POST /api/auth/google/refresh
 * Refreshes a Google access token using the refresh token.
 * The client decrypts its stored refresh token and sends it here.
 * Server uses the client_secret (from Infisical) to perform the refresh,
 * returns the new access token. Neither token is persisted server-side.
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (!isAuthed(auth)) return auth

    const { refresh_token } = await request.json()
    if (!refresh_token || typeof refresh_token !== 'string') {
      return NextResponse.json({ error: 'Missing refresh_token' }, { status: 400 })
    }

    const result = await refreshGoogleToken(refresh_token)

    return NextResponse.json({
      access_token: result.access_token,
      expires_in: result.expires_in,
    })
  } catch (err) {
    console.error('Token refresh error:', err)
    return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 })
  }
}
