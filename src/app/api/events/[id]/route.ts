import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        source: { select: { id: true, name: true, color: true, sourceType: true } },
        location: true,
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (err) {
    console.error('Event GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const event = await prisma.event.update({
      where: { id: params.id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.start !== undefined && { start: new Date(body.start) }),
        ...(body.end !== undefined && { end: new Date(body.end) }),
        ...(body.all_day !== undefined && { allDay: body.all_day }),
        ...(body.location_raw !== undefined && { locationRaw: body.location_raw }),
        ...(body.latitude !== undefined && { latitude: body.latitude }),
        ...(body.longitude !== undefined && { longitude: body.longitude }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.event_category !== undefined && { eventCategory: body.event_category }),
        ...(body.metadata !== undefined && { metadata: body.metadata }),
      },
    })

    return NextResponse.json(event)
  } catch (err) {
    console.error('Event PUT error:', err)
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.event.delete({ where: { id: params.id } })
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('Event DELETE error:', err)
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
