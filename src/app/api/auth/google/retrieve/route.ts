import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, isAuthed } from '@/lib/auth'
import { getPendingToken } from '@/lib/pending-tokens'

/**
 * POST /api/auth/google/retrieve
 * One-time retrieval of OAuth tokens after successful callback.
 * Requires authentication. Returns tokens exactly once; they are deleted
 * from server memory after retrieval. The client must encrypt them with
 * EncryptID before storing.
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (!isAuthed(auth)) return auth

    const { code } = await request.json()
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Missing retrieval code' }, { status: 400 })
    }

    const tokenData = getPendingToken(code)
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Token expired or already retrieved' },
        { status: 410 }
      )
    }

    // Return tokens — client will encrypt with EncryptID immediately
    return NextResponse.json(tokenData)
  } catch (err) {
    console.error('Token retrieval error:', err)
    return NextResponse.json({ error: 'Failed to retrieve tokens' }, { status: 500 })
  }
}
