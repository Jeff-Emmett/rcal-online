'use client'

import { useMemo } from 'react'
import { useCalendarStore, useEffectiveSpatialGranularity } from '@/lib/store'
import { getSemanticLocationLabel } from '@/lib/location'
import { useMonthEvents, groupEventsByDate } from '@/hooks/useEvents'
import type { EventListItem } from '@/lib/types'
import { EventDetailModal } from './EventDetailModal'
import { clsx } from 'clsx'

interface DayCell {
  date: Date
  dateKey: string
  day: number
  isCurrentMonth: boolean
  isToday: boolean
}

export function MonthView() {
  const { currentDate, showLunarOverlay, selectedEventId, setSelectedEventId, hiddenSources } = useCalendarStore()
  const effectiveSpatial = useEffectiveSpatialGranularity()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  // Fetch events for the current month
  const { data: eventsData, isLoading } = useMonthEvents(year, month)

  // Group events by date, filtering out hidden sources
  const eventsByDate = useMemo(() => {
    if (!eventsData?.results) return new Map<string, EventListItem[]>()
    const visibleEvents = eventsData.results.filter(
      (event) => !hiddenSources.includes(event.source)
    )
    return groupEventsByDate(visibleEvents)
  }, [eventsData?.results, hiddenSources])

  const monthData = useMemo(() => {
    return generateGregorianMonth(currentDate)
  }, [currentDate])

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      {/* Month header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {new Date(monthData.year, monthData.month - 1).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </h2>
          {eventsData && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {hiddenSources.length > 0 ? (
                <>
                  {eventsData.results.filter(e => !hiddenSources.includes(e.source)).length} of {eventsData.count} events
                </>
              ) : (
                <>{eventsData.count} events</>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="flex-1 overflow-auto p-2">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-px mb-1">
          {weekdays.map((day, i) => (
            <div
              key={day}
              className={clsx(
                'text-center text-sm font-medium py-2',
                i === 0 ? 'text-red-500' : 'text-gray-600 dark:text-gray-400',
                i === 6 && 'text-blue-500'
              )}
            >
              {day.slice(0, 3)}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-gray-700 calendar-grid">
          {monthData.days.map((day, i) => (
            <DayCellComponent
              key={i}
              day={day}
              showLunarOverlay={showLunarOverlay}
              events={eventsByDate.get(day.dateKey) || []}
              isLoading={isLoading}
              onEventClick={setSelectedEventId}
              effectiveSpatial={effectiveSpatial}
            />
          ))}
        </div>
      </div>

      {/* Event detail modal */}
      {selectedEventId && (
        <EventDetailModal
          eventId={selectedEventId}
          onClose={() => setSelectedEventId(null)}
        />
      )}
    </div>
  )
}

function DayCellComponent({
  day,
  showLunarOverlay,
  events,
  isLoading,
  onEventClick,
  effectiveSpatial,
}: {
  day: DayCell
  showLunarOverlay: boolean
  events: EventListItem[]
  isLoading: boolean
  onEventClick: (eventId: string | null) => void
  effectiveSpatial: number
}) {
  const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6
  const maxVisibleEvents = 3
  const hasMoreEvents = events.length > maxVisibleEvents
  const visibleEvents = events.slice(0, maxVisibleEvents)

  return (
    <div
      className={clsx(
        'min-h-[100px] p-2 bg-white dark:bg-gray-800 transition-colors',
        !day.isCurrentMonth && 'bg-gray-50 dark:bg-gray-900 opacity-50',
        day.isToday && 'ring-2 ring-blue-500 ring-inset',
        'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'
      )}
    >
      {/* Day number */}
      <div className="flex items-start justify-between">
        <span
          className={clsx(
            'inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium',
            day.isToday && 'bg-blue-500 text-white',
            !day.isToday && isWeekend && 'text-gray-400 dark:text-gray-500',
            !day.isToday && !isWeekend && 'text-gray-900 dark:text-white'
          )}
        >
          {day.day}
        </span>

        {/* Lunar phase overlay slot - Phase 2 */}
      </div>

      {/* Events */}
      <div className="mt-1 space-y-0.5">
        {isLoading ? (
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
        ) : (
          <>
            {visibleEvents.map((event) => {
              const locationLabel = getSemanticLocationLabel(event, effectiveSpatial)
              return (
                <div
                  key={event.id}
                  className="text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: event.source_color || '#3b82f6',
                    color: '#fff',
                  }}
                  title={`${event.title}${locationLabel ? ` - ${locationLabel}` : ''}${event.all_day ? ' (All day)' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onEventClick(event.id)
                  }}
                >
                  {!event.all_day && (
                    <span className="opacity-75 mr-1">
                      {new Date(event.start).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                  {event.title}
                  {locationLabel && (
                    <span className="opacity-60 ml-1 text-[10px]">{locationLabel}</span>
                  )}
                </div>
              )
            })}
            {hasMoreEvents && (
              <div className="text-xs text-gray-500 dark:text-gray-400 px-1.5">
                +{events.length - maxVisibleEvents} more
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function generateGregorianMonth(date: Date): {
  year: number
  month: number
  days: DayCell[]
} {
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const daysInMonth = lastDay.getDate()
  const startDayOfWeek = firstDay.getDay()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const days: DayCell[] = []

  // Previous month's trailing days
  const prevMonth = new Date(year, month - 2, 1)
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate()
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i
    const d = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), dayNum)
    days.push({
      date: d,
      dateKey: d.toISOString().split('T')[0],
      day: dayNum,
      isCurrentMonth: false,
      isToday: false,
    })
  }

  // Current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month - 1, i)
    days.push({
      date: d,
      dateKey: d.toISOString().split('T')[0],
      day: i,
      isCurrentMonth: true,
      isToday: d.getTime() === today.getTime(),
    })
  }

  // Next month's leading days
  const remainingDays = 42 - days.length // 6 rows x 7 days
  for (let i = 1; i <= remainingDays; i++) {
    const d = new Date(year, month, i)
    days.push({
      date: d,
      dateKey: d.toISOString().split('T')[0],
      day: i,
      isCurrentMonth: false,
      isToday: false,
    })
  }

  return { year, month, days }
}
