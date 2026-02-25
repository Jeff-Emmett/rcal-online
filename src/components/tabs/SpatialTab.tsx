'use client'

import { useMemo } from 'react'
import { useCalendarStore } from '@/lib/store'
import { useEvents } from '@/hooks/useEvents'
import { TemporalGranularity } from '@/lib/types'
import { SplitView } from '@/components/calendar/SplitView'
import { DayView } from '@/components/calendar/DayView'
import { WeekView } from '@/components/calendar/WeekView'
import { MonthView } from '@/components/calendar/MonthView'
import { SeasonView } from '@/components/calendar/SeasonView'
import { YearView } from '@/components/calendar/YearView'

function getDateRangeForGranularity(
  date: Date,
  granularity: TemporalGranularity
): { start: string; end: string } {
  const d = new Date(date)
  let start: Date
  let end: Date

  switch (granularity) {
    case TemporalGranularity.DAY:
      start = new Date(d.getFullYear(), d.getMonth(), d.getDate())
      end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
      break
    case TemporalGranularity.WEEK:
      start = new Date(d)
      start.setDate(d.getDate() - d.getDay())
      end = new Date(start)
      end.setDate(start.getDate() + 7)
      break
    case TemporalGranularity.MONTH:
      start = new Date(d.getFullYear(), d.getMonth(), 1)
      end = new Date(d.getFullYear(), d.getMonth() + 1, 0)
      break
    case TemporalGranularity.SEASON: {
      const qMonth = Math.floor(d.getMonth() / 3) * 3
      start = new Date(d.getFullYear(), qMonth, 1)
      end = new Date(d.getFullYear(), qMonth + 3, 0)
      break
    }
    case TemporalGranularity.YEAR:
    case TemporalGranularity.DECADE:
    default:
      start = new Date(d.getFullYear(), 0, 1)
      end = new Date(d.getFullYear(), 11, 31)
      break
  }

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  }
}

function CalendarView() {
  const { temporalGranularity } = useCalendarStore()

  switch (temporalGranularity) {
    case TemporalGranularity.YEAR:
    case TemporalGranularity.DECADE:
    case TemporalGranularity.CENTURY:
    case TemporalGranularity.COSMIC:
      return <YearView />
    case TemporalGranularity.SEASON:
      return <SeasonView />
    case TemporalGranularity.MONTH:
      return <MonthView />
    case TemporalGranularity.WEEK:
      return <WeekView />
    case TemporalGranularity.DAY:
    case TemporalGranularity.HOUR:
    case TemporalGranularity.MOMENT:
      return <DayView />
    default:
      return <MonthView />
  }
}

export function SpatialTab() {
  const { temporalGranularity, currentDate, hiddenSources } = useCalendarStore()

  const dateRange = useMemo(
    () => getDateRangeForGranularity(currentDate, temporalGranularity),
    [currentDate, temporalGranularity]
  )
  const { data: eventsData } = useEvents(dateRange)

  const visibleEvents = useMemo(() => {
    if (!eventsData?.results) return []
    return eventsData.results.filter((e) => !hiddenSources.includes(e.source))
  }, [eventsData?.results, hiddenSources])

  return (
    <SplitView
      calendarContent={<CalendarView />}
      events={visibleEvents}
    />
  )
}
