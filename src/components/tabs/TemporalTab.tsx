'use client'

import { useCalendarStore } from '@/lib/store'
import { TemporalGranularity } from '@/lib/types'
import { MonthView } from '@/components/calendar/MonthView'
import { SeasonView } from '@/components/calendar/SeasonView'
import { YearView } from '@/components/calendar/YearView'

export function TemporalTab() {
  const { temporalGranularity } = useCalendarStore()

  const CalendarView = () => {
    switch (temporalGranularity) {
      case TemporalGranularity.YEAR:
      case TemporalGranularity.DECADE:
        return <YearView />
      case TemporalGranularity.SEASON:
        return <SeasonView />
      case TemporalGranularity.MONTH:
      case TemporalGranularity.WEEK:
      case TemporalGranularity.DAY:
      default:
        return <MonthView />
    }
  }

  return (
    <main className="h-full overflow-auto p-4">
      <CalendarView />
    </main>
  )
}
