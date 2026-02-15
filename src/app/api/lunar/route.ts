import { NextRequest, NextResponse } from 'next/server'
import { getLunarPhaseForDate, getLunarDataForRange, getSynodicMonth, getMoonTimesForLocation } from '@/lib/lunar'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const start = searchParams.get('start')
  const end = searchParams.get('end')
  const date = searchParams.get('date')
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')

  try {
    // Single date query
    if (date && !start && !end) {
      const d = new Date(date)
      const phase = getLunarPhaseForDate(d)
      const synodic = getSynodicMonth(d)

      const result: Record<string, unknown> = { date, phase, synodic_month: synodic }

      // Add location-aware data if lat/lng provided
      if (lat && lng) {
        const moonTimes = getMoonTimesForLocation(d, parseFloat(lat), parseFloat(lng))
        result.moon_times = {
          rise: moonTimes.rise?.toISOString() || null,
          set: moonTimes.set?.toISOString() || null,
          always_up: moonTimes.alwaysUp,
          always_down: moonTimes.alwaysDown,
        }
      }

      return NextResponse.json(result)
    }

    // Date range query
    if (start && end) {
      const startDate = new Date(start)
      const endDate = new Date(end)

      // Limit range to 366 days
      const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      if (daysDiff > 366) {
        return NextResponse.json(
          { error: 'Date range cannot exceed 366 days' },
          { status: 400 }
        )
      }

      const lunarData = getLunarDataForRange(startDate, endDate)

      // Convert Map to plain object for JSON serialization
      const phases: Record<string, unknown> = {}
      lunarData.forEach((value, key) => {
        phases[key] = value
      })

      return NextResponse.json({
        start,
        end,
        count: lunarData.size,
        phases,
      })
    }

    // Default: today
    const today = new Date()
    const phase = getLunarPhaseForDate(today)
    const synodic = getSynodicMonth(today)

    return NextResponse.json({
      date: today.toISOString().split('T')[0],
      phase,
      synodic_month: synodic,
    })
  } catch (err) {
    console.error('Lunar API error:', err)
    return NextResponse.json({ error: 'Failed to compute lunar data' }, { status: 500 })
  }
}
