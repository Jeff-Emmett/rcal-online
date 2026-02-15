import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { RToolName } from '@/lib/types'

const VALID_TOOLS: RToolName[] = ['rTrips', 'rNetwork', 'rMaps', 'rCart', 'rNotes', 'standalone']

export async function GET(
  request: NextRequest,
  { params }: { params: { tool: string } }
) {
  const tool = params.tool as RToolName

  if (!VALID_TOOLS.includes(tool)) {
    return NextResponse.json(
      { error: `Invalid tool: ${tool}. Valid: ${VALID_TOOLS.join(', ')}` },
      { status: 400 }
    )
  }

  const { searchParams } = request.nextUrl
  const entityId = searchParams.get('entity_id')
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  const where: Record<string, unknown> = {
    rToolSource: tool,
  }

  if (entityId) {
    where.rToolEntityId = entityId
  }
  if (start) {
    where.start = { gte: new Date(start) }
  }
  if (end) {
    where.end = { lte: new Date(end) }
  }

  try {
    const events = await prisma.event.findMany({
      where,
      include: {
        source: { select: { id: true, name: true, color: true, sourceType: true } },
      },
      orderBy: { start: 'asc' },
      take: 500,
    })

    const results = events.map((e) => ({
      id: e.id,
      source: e.sourceId,
      source_name: e.source.name,
      source_color: e.source.color,
      title: e.title,
      description: e.description,
      start: e.start.toISOString(),
      end: e.end.toISOString(),
      all_day: e.allDay,
      r_tool_source: e.rToolSource,
      r_tool_entity_id: e.rToolEntityId,
      event_category: e.eventCategory,
      metadata: e.metadata,
    }))

    return NextResponse.json({ tool, count: results.length, results })
  } catch (err) {
    console.error('Context API error:', err)
    return NextResponse.json({ error: 'Failed to fetch context events' }, { status: 500 })
  }
}
