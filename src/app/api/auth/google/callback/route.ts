import { NextRequest, NextResponse } from 'next/server'
import { exchangeGoogleCode, fetchGoogleCalendars } from '@/lib/oauth'
import { storePendingToken } from '@/lib/pending-tokens'
import { cookies } from 'next/headers'

/**
 * GET /api/auth/google/callback
 * Handles the OAuth callback from Google.
 * Validates CSRF state, exchanges code for tokens, stores tokens in memory
 * for one-time client retrieval, then redirects to calendar page.
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

    // Validate CSRF state token
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

    // Clear the state cookie
    cookieStore.delete('oauth_state')

    // Exchange authorization code for tokens (server-side, uses client_secret)
    const tokens = await exchangeGoogleCode(code)

    // Fetch the user's calendars to find the primary one
    const calendars = await fetchGoogleCalendars(tokens.access_token)

    // Generate a one-time retrieval code (NOT the OAuth tokens themselves)
    const retrievalCode = crypto.randomUUID()

    // Store tokens in memory for one-time pickup (60 second TTL)
    storePendingToken(retrievalCode, {
      provider: 'google',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
      calendars: calendars.map((c) => ({
        id: c.id,
        name: c.summary,
        color: c.backgroundColor,
        primary: c.primary,
      })),
    })

    // Redirect to client with only the retrieval code — no tokens in the URL
    return NextResponse.redirect(
      new URL(`/rcal/calendar?connect=pending&rc=${retrievalCode}`, request.url)
    )
  } catch (err) {
    console.error('Google callback error:', err)
    return NextResponse.redirect(
      new URL('/rcal/calendar?connect=error&reason=exchange_failed', request.url)
    )
  }
}
