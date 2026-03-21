import { NextRequest, NextResponse } from 'next/server'
import { exchangeMicrosoftCode } from '@/lib/oauth'
import { storePendingToken } from '@/lib/pending-tokens'
import { cookies } from 'next/headers'

/**
 * GET /api/auth/microsoft/callback
 * Handles the OAuth callback from Microsoft.
 * Tokens stored in memory for one-time client retrieval + EncryptID encryption.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.redirect(new URL('/rcal/calendar?connect=denied', request.url))
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/rcal/calendar?connect=error&reason=missing_params', request.url)
      )
    }

    const cookieStore = await cookies()
    const stateCookie = cookieStore.get('oauth_state')
    if (!stateCookie?.value) {
      return NextResponse.redirect(
        new URL('/rcal/calendar?connect=error&reason=expired_session', request.url)
      )
    }

    let statePayload: { csrf: string; userId: string }
    try {
      statePayload = JSON.parse(stateCookie.value)
    } catch {
      return NextResponse.redirect(
        new URL('/rcal/calendar?connect=error&reason=invalid_state', request.url)
      )
    }

    if (statePayload.csrf !== state) {
      return NextResponse.redirect(
        new URL('/rcal/calendar?connect=error&reason=csrf_mismatch', request.url)
      )
    }

    cookieStore.delete('oauth_state')

    const tokens = await exchangeMicrosoftCode(code)

    const retrievalCode = crypto.randomUUID()

    storePendingToken(retrievalCode, {
      provider: 'outlook',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
      calendars: [{ id: 'primary', name: 'Outlook Calendar', color: '#0078d4', primary: true }],
    })

    return NextResponse.redirect(
      new URL(`/rcal/calendar?connect=pending&rc=${retrievalCode}`, request.url)
    )
  } catch (err) {
    console.error('Microsoft callback error:', err)
    return NextResponse.redirect(
      new URL('/rcal/calendar?connect=error&reason=exchange_failed', request.url)
    )
  }
}
