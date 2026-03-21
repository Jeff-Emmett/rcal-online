import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, isAuthed } from '@/lib/auth'
import { buildGoogleAuthUrl, generateStateToken } from '@/lib/oauth'
import { cookies } from 'next/headers'

/**
 * GET /api/auth/google/authorize
 * Generates a Google OAuth URL and redirects the user.
 * CSRF protection via a state token stored in a secure httpOnly cookie.
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (!isAuthed(auth)) return auth

    const stateToken = generateStateToken()

    // Store state + user ID in a secure, httpOnly, short-lived cookie
    const statePayload = JSON.stringify({
      csrf: stateToken,
      userId: auth.user.id,
    })

    const cookieStore = await cookies()
    cookieStore.set('oauth_state', statePayload, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    })

    const authUrl = buildGoogleAuthUrl(stateToken)
    return NextResponse.redirect(authUrl)
  } catch (err) {
    console.error('Google authorize error:', err)
    const message = err instanceof Error ? err.message : 'OAuth configuration error'

    if (message.includes('not configured')) {
      return NextResponse.json(
        { error: 'Google Calendar integration is not yet configured' },
        { status: 503 }
      )
    }

    return NextResponse.json({ error: 'Failed to initiate OAuth' }, { status: 500 })
  }
}
