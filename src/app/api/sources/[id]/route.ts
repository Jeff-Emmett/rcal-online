import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const source = await prisma.calendarSource.findUnique({
      where: { id: params.id },
      include: { _count: { select: { events: true } } },
    })

    if (!source) {
      return NextResponse.json({ error: 'Source not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...source,
      event_count: source._count.events,
    })
  } catch (err) {
    console.error('Source GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch source' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const source = await prisma.calendarSource.update({
      where: { id: params.id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.color !== undefined && { color: body.color }),
        ...(body.is_visible !== undefined && { isVisible: body.is_visible }),
        ...(body.is_active !== undefined && { isActive: body.is_active }),
        ...(body.sync_config !== undefined && { syncConfig: body.sync_config }),
      },
    })

    return NextResponse.json(source)
  } catch (err) {
    console.error('Source PUT error:', err)
    return NextResponse.json({ error: 'Failed to update source' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.calendarSource.delete({ where: { id: params.id } })
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('Source DELETE error:', err)
    return NextResponse.json({ error: 'Failed to delete source' }, { status: 500 })
  }
}
