import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAuthed } from '@/lib/auth'

export async function GET() {
  try {
    const sources = await prisma.calendarSource.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { events: true } },
      },
    })

    const results = sources.map((s) => ({
      id: s.id,
      name: s.name,
      source_type: s.sourceType,
      source_type_display: s.sourceType.charAt(0).toUpperCase() + s.sourceType.slice(1),
      color: s.color,
      is_visible: s.isVisible,
      is_active: s.isActive,
      last_synced_at: s.lastSyncedAt?.toISOString() || null,
      sync_error: s.syncError,
      event_count: s._count.events,
    }))

    return NextResponse.json({ count: results.length, results })
  } catch (err) {
    console.error('Sources GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch sources' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (!isAuthed(auth)) return auth

    const body = await request.json()

    const source = await prisma.calendarSource.create({
      data: {
        name: body.name,
        sourceType: body.source_type || 'manual',
        color: body.color || '#6b7280',
        isVisible: body.is_visible ?? true,
        isActive: body.is_active ?? true,
        syncConfig: body.sync_config || null,
        createdById: auth.user.id,
      },
    })

    return NextResponse.json(source, { status: 201 })
  } catch (err) {
    console.error('Sources POST error:', err)
    return NextResponse.json({ error: 'Failed to create source' }, { status: 500 })
  }
}
