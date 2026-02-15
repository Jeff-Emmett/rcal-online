import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const start = searchParams.get('start')
  const end = searchParams.get('end')
  const source = searchParams.get('source')
  const rToolSource = searchParams.get('r_tool_source')
  const rToolEntityId = searchParams.get('r_tool_entity_id')
  const limit = parseInt(searchParams.get('limit') || '500', 10)
  const offset = parseInt(searchParams.get('offset') || '0', 10)

  const where: Record<string, unknown> = {}

  if (start) {
    where.start = { ...(where.start as object || {}), gte: new Date(start) }
  }
  if (end) {
    where.end = { ...(where.end as object || {}), lte: new Date(end) }
  }
  if (source) {
    where.sourceId = source
  }
  if (rToolSource) {
    where.rToolSource = rToolSource
  }
  if (rToolEntityId) {
    where.rToolEntityId = rToolEntityId
  }

  try {
    const [events, count] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          source: {
            select: { id: true, name: true, color: true, sourceType: true },
          },
          location: {
            select: { id: true, name: true, slug: true, granularity: true, latitude: true, longitude: true },
          },
        },
        orderBy: { start: 'asc' },
        take: limit,
        skip: offset,
      }),
      prisma.event.count({ where }),
    ])

    // Transform to API response format matching UnifiedEvent
    const results = events.map((e) => ({
      id: e.id,
      source: e.sourceId,
      source_name: e.source.name,
      source_color: e.source.color,
      source_type: e.source.sourceType,
      external_id: e.externalId,
      title: e.title,
      description: e.description,
      start: e.start.toISOString(),
      end: e.end.toISOString(),
      all_day: e.allDay,
      timezone_str: e.timezoneStr,
      rrule: e.rrule,
      is_recurring: e.isRecurring,
      location: e.locationId,
      location_raw: e.locationRaw,
      location_display: e.location?.name || null,
      location_breadcrumb: null,
      latitude: e.latitude,
      longitude: e.longitude,
      coordinates: e.latitude && e.longitude ? { latitude: e.latitude, longitude: e.longitude } : null,
      location_granularity: e.location?.granularity || null,
      is_virtual: e.isVirtual,
      virtual_url: e.virtualUrl,
      virtual_platform: e.virtualPlatform,
      organizer_name: e.organizerName,
      organizer_email: e.organizerEmail,
      attendees: e.attendees,
      attendee_count: e.attendeeCount,
      status: e.status,
      visibility: e.visibility,
      duration_minutes: Math.round((e.end.getTime() - e.start.getTime()) / 60000),
      is_upcoming: e.start > new Date(),
      is_ongoing: e.start <= new Date() && e.end >= new Date(),
      r_tool_source: e.rToolSource,
      r_tool_entity_id: e.rToolEntityId,
      event_category: e.eventCategory,
      metadata: e.metadata,
    }))

    return NextResponse.json({ count, results })
  } catch (err) {
    console.error('Events GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const event = await prisma.event.create({
      data: {
        sourceId: body.source_id,
        externalId: body.external_id || '',
        title: body.title,
        description: body.description || '',
        start: new Date(body.start),
        end: new Date(body.end),
        allDay: body.all_day || false,
        timezoneStr: body.timezone_str || 'UTC',
        rrule: body.rrule || '',
        isRecurring: body.is_recurring || false,
        locationRaw: body.location_raw || '',
        locationId: body.location_id || null,
        latitude: body.latitude || null,
        longitude: body.longitude || null,
        isVirtual: body.is_virtual || false,
        virtualUrl: body.virtual_url || '',
        virtualPlatform: body.virtual_platform || '',
        organizerName: body.organizer_name || '',
        organizerEmail: body.organizer_email || '',
        attendees: body.attendees || [],
        attendeeCount: body.attendee_count || 0,
        status: body.status || 'confirmed',
        visibility: body.visibility || 'default',
        rToolSource: body.r_tool_source || null,
        rToolEntityId: body.r_tool_entity_id || null,
        eventCategory: body.event_category || null,
        metadata: body.metadata || null,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (err) {
    console.error('Events POST error:', err)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
