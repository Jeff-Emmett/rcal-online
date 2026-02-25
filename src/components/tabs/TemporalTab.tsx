'use client'

import { useRef, useEffect, useState } from 'react'
import { useCalendarStore } from '@/lib/store'
import { TemporalGranularity } from '@/lib/types'
import { DayView } from '@/components/calendar/DayView'
import { WeekView } from '@/components/calendar/WeekView'
import { MonthView } from '@/components/calendar/MonthView'
import { SeasonView } from '@/components/calendar/SeasonView'
import { YearView } from '@/components/calendar/YearView'
import { FullscreenToggle } from '@/components/calendar/FullscreenToggle'

function getViewForGranularity(granularity: TemporalGranularity) {
  switch (granularity) {
    case TemporalGranularity.DAY:
    case TemporalGranularity.HOUR:
    case TemporalGranularity.MOMENT:
      return DayView
    case TemporalGranularity.WEEK:
      return WeekView
    case TemporalGranularity.MONTH:
      return MonthView
    case TemporalGranularity.SEASON:
      return SeasonView
    case TemporalGranularity.YEAR:
    case TemporalGranularity.DECADE:
    case TemporalGranularity.CENTURY:
    case TemporalGranularity.COSMIC:
      return YearView
    default:
      return MonthView
  }
}

export function TemporalTab() {
  const { temporalGranularity } = useCalendarStore()
  const [transitioning, setTransitioning] = useState(false)
  const prevGranularity = useRef(temporalGranularity)

  useEffect(() => {
    if (prevGranularity.current !== temporalGranularity) {
      setTransitioning(true)
      const timer = setTimeout(() => setTransitioning(false), 200)
      prevGranularity.current = temporalGranularity
      return () => clearTimeout(timer)
    }
  }, [temporalGranularity])

  const ViewComponent = getViewForGranularity(temporalGranularity)

  return (
    <FullscreenToggle>
      {(isFullscreen) => (
        <main
          className="h-full overflow-auto p-4 transition-opacity duration-200"
          style={{ opacity: transitioning ? 0 : 1 }}
        >
          <div className="h-full">
            <ViewComponent />
          </div>
        </main>
      )}
    </FullscreenToggle>
  )
}
