/**
 * OAuth 2.0 helpers for calendar provider integrations.
 * Server-side only — handles code exchange with provider secrets from Infisical.
 * Tokens are returned to the client for EncryptID encryption; never persisted server-side.
 */

// ── Google Calendar OAuth ──

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'

const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events.readonly',
].join(' ')

function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI ||
    `${process.env.NEXT_PUBLIC_APP_URL || 'https://rspace.online/rcal'}/api/auth/google/callback`

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials not configured')
  }

  return { clientId, clientSecret, redirectUri }
}

/**
 * Generate a Google OAuth 2.0 authorization URL.
 * Includes a CSRF state token that must be verified on callback.
 */
export function buildGoogleAuthUrl(stateToken: string): string {
  const { clientId, redirectUri } = getGoogleCredentials()

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: GOOGLE_SCOPES,
    access_type: 'offline',
    prompt: 'consent',
    state: stateToken,
  })

  return `${GOOGLE_AUTH_URL}?${params.toString()}`
}

/**
 * Exchange an authorization code for tokens. Server-side only.
 * Returns tokens that the client will encrypt with EncryptID.
 */
export async function exchangeGoogleCode(code: string): Promise<{
  access_token: string
  refresh_token?: string
  expires_in: number
  token_type: string
  scope: string
}> {
  const { clientId, clientSecret, redirectUri } = getGoogleCredentials()

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Google token exchange failed: ${error}`)
  }

  return response.json()
}

/**
 * Refresh an access token using a refresh token. Server-side only.
 * Called when the client sends an expired token for sync.
 */
export async function refreshGoogleToken(refreshToken: string): Promise<{
  access_token: string
  expires_in: number
  token_type: string
  scope: string
}> {
  const { clientId, clientSecret } = getGoogleCredentials()

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Google token refresh failed: ${error}`)
  }

  return response.json()
}

/**
 * Fetch events from Google Calendar using a user-provided access token.
 * Token is ephemeral — passed per-request, never stored.
 */
export async function fetchGoogleCalendarEvents(
  accessToken: string,
  calendarId: string = 'primary',
  timeMin?: string,
  timeMax?: string,
): Promise<Array<Record<string, unknown>>> {
  const params = new URLSearchParams({
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '2500',
  })
  if (timeMin) params.set('timeMin', timeMin)
  if (timeMax) params.set('timeMax', timeMax)

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )

  if (!response.ok) {
    throw new Error(`Google Calendar API error: ${response.status}`)
  }

  const data = await response.json()
  return data.items || []
}

/**
 * Fetch user's Google calendar list to let them choose which to sync.
 */
export async function fetchGoogleCalendars(accessToken: string): Promise<Array<{
  id: string
  summary: string
  description?: string
  backgroundColor?: string
  primary?: boolean
}>> {
  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/users/me/calendarList',
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch Google calendars: ${response.status}`)
  }

  const data = await response.json()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.items || []).map((cal: any) => ({
    id: cal.id as string,
    summary: cal.summary as string,
    description: cal.description as string | undefined,
    backgroundColor: cal.backgroundColor as string | undefined,
    primary: cal.primary as boolean | undefined,
  }))
}

// ── Outlook/Microsoft Calendar OAuth ──

const MS_AUTH_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
const MS_TOKEN_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'

const MS_SCOPES = ['Calendars.Read', 'offline_access'].join(' ')

function getMicrosoftCredentials() {
  const clientId = process.env.MICROSOFT_OAUTH_CLIENT_ID
  const clientSecret = process.env.MICROSOFT_OAUTH_CLIENT_SECRET
  const redirectUri = process.env.MICROSOFT_OAUTH_REDIRECT_URI ||
    `${process.env.NEXT_PUBLIC_APP_URL || 'https://rspace.online/rcal'}/api/auth/microsoft/callback`

  if (!clientId || !clientSecret) {
    throw new Error('Microsoft OAuth credentials not configured')
  }

  return { clientId, clientSecret, redirectUri }
}

export function buildMicrosoftAuthUrl(stateToken: string): string {
  const { clientId, redirectUri } = getMicrosoftCredentials()

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: MS_SCOPES,
    state: stateToken,
    response_mode: 'query',
  })

  return `${MS_AUTH_URL}?${params.toString()}`
}

export async function exchangeMicrosoftCode(code: string): Promise<{
  access_token: string
  refresh_token?: string
  expires_in: number
  token_type: string
  scope: string
}> {
  const { clientId, clientSecret, redirectUri } = getMicrosoftCredentials()

  const response = await fetch(MS_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Microsoft token exchange failed: ${error}`)
  }

  return response.json()
}

// ── Utility: generate CSRF state token ──

export function generateStateToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('')
}
