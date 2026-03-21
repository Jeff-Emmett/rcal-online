import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, isAuthed } from '@/lib/auth'
import { buildMicrosoftAuthUrl, generateStateToken } from '@/lib/oauth'
import { cookies } from 'next/headers'

/**
 * GET /api/auth/microsoft/authorize
 * Generates a Microsoft OAuth URL and redirects the user.
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (!isAuthed(auth)) return auth

    const stateToken = generateStateToken()

    const statePayload = JSON.stringify({
      csrf: stateToken,
      userId: auth.user.id,
    })

    const cookieStore = await cookies()
    cookieStore.set('oauth_state', statePayload, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    })

    const authUrl = buildMicrosoftAuthUrl(stateToken)
    return NextResponse.redirect(authUrl)
  } catch (err) {
    console.error('Microsoft authorize error:', err)
    const message = err instanceof Error ? err.message : 'OAuth configuration error'

    if (message.includes('not configured')) {
      return NextResponse.json(
        { error: 'Microsoft Calendar integration is not yet configured' },
        { status: 503 }
      )
    }

    return NextResponse.json({ error: 'Failed to initiate OAuth' }, { status: 500 })
  }
}
