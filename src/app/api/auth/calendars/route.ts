import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, isAuthed } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/auth/calendars
 * Returns the authenticated user's calendar sources from the DB.
 * Note: OAuth tokens are stored client-side (encrypted by EncryptID),
 * so this only returns source metadata — never credentials.
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (!isAuthed(auth)) return auth

    const sources = await prisma.calendarSource.findMany({
      where: { createdById: auth.user.id },
      select: {
        id: true,
        name: true,
        sourceType: true,
        color: true,
        isActive: true,
        lastSyncedAt: true,
        syncError: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      sources: sources.map((s: typeof sources[number]) => ({
        id: s.id,
        name: s.name,
        provider: s.sourceType,
        color: s.color,
        is_active: s.isActive,
        last_synced_at: s.lastSyncedAt?.toISOString() || null,
        has_error: !!s.syncError,
      })),
    })
  } catch (err) {
    console.error('Connected calendars error:', err)
    return NextResponse.json({ error: 'Failed to fetch connected calendars' }, { status: 500 })
  }
}
