'use client'

import { useMemo } from 'react'
import { useCalendarStore, useEffectiveSpatialGranularity } from '@/lib/store'
import { getSemanticLocationLabel } from '@/lib/location'
import { useMonthEvents } from '@/hooks/useEvents'
import type { EventListItem } from '@/lib/types'
import { EventDetailModal } from './EventDetailModal'
import { clsx } from 'clsx'

const HOURS = Array.from({ length: 24 }, (_, i) => i)

function formatHour(hour: number): string {
  if (hour === 0) return '12 AM'
  if (hour < 12) return `${hour} AM`
  if (hour === 12) return '12 PM'
  return `${hour - 12} PM`
}

function getEventPosition(event: EventListItem, dayStart: Date) {
  const start = new Date(event.start)
  const end = new Date(event.end)
  const dayEnd = new Date(dayStart)
  dayEnd.setHours(23, 59, 59, 999)

  // Clamp to day boundaries
  const effectiveStart = start < dayStart ? dayStart : start
  const effectiveEnd = end > dayEnd ? dayEnd : end

  const startMinutes = effectiveStart.getHours() * 60 + effectiveStart.getMinutes()
  const endMinutes = effectiveEnd.getHours() * 60 + effectiveEnd.getMinutes()
  const duration = Math.max(endMinutes - startMinutes, 30) // Minimum 30 min display

  return {
    top: (startMinutes / (24 * 60)) * 100,
    height: (duration / (24 * 60)) * 100,
  }
}

export function DayView() {
  const { currentDate, selectedEventId, setSelectedEventId, hiddenSources } = useCalendarStore()
  const effectiveSpatial = useEffectiveSpatialGranularity()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  const { data: eventsData, isLoading } = useMonthEvents(year, month)

  const dateKey = useMemo(() => {
    return currentDate.toISOString().split('T')[0]
  }, [currentDate])

  const dayStart = useMemo(() => {
    const d = new Date(currentDate)
    d.setHours(0, 0, 0, 0)
    return d
  }, [currentDate])

  const { allDayEvents, timedEvents } = useMemo(() => {
    if (!eventsData?.results) return { allDayEvents: [], timedEvents: [] }

    const dayEvents = eventsData.results.filter((event) => {
      if (hiddenSources.includes(event.source)) return false
      const eventDate = new Date(event.start).toISOString().split('T')[0]
      const eventEnd = new Date(event.end).toISOString().split('T')[0]
      return eventDate <= dateKey && eventEnd >= dateKey
    })

    return {
      allDayEvents: dayEvents.filter((e) => e.all_day),
      timedEvents: dayEvents.filter((e) => !e.all_day),
    }
  }, [eventsData?.results, dateKey, hiddenSources])

  const isToday = useMemo(() => {
    const today = new Date()
    return (
      currentDate.getFullYear() === today.getFullYear() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getDate() === today.getDate()
    )
  }, [currentDate])

  const nowPosition = useMemo(() => {
    if (!isToday) return null
    const now = new Date()
    const minutes = now.getHours() * 60 + now.getMinutes()
    return (minutes / (24 * 60)) * 100
  }, [isToday])

  const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' })
  const dateDisplay = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Day header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {dayOfWeek}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{dateDisplay}</p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {allDayEvents.length + timedEvents.length} events
          </div>
        </div>
      </div>

      {/* All-day events */}
      {allDayEvents.length > 0 && (
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">All Day</div>
          <div className="flex flex-wrap gap-1">
            {allDayEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => setSelectedEventId(event.id)}
                className="text-xs px-2 py-1 rounded truncate max-w-[200px] hover:opacity-80 transition-opacity"
                style={{
                  backgroundColor: event.source_color || '#3b82f6',
                  color: '#fff',
                }}
              >
                {event.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Time grid */}
      <div className="flex-1 overflow-auto relative">
        <div className="relative" style={{ minHeight: '1440px' }}>
          {/* Hour lines */}
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="absolute w-full flex border-b border-gray-100 dark:border-gray-700/50"
              style={{ top: `${(hour / 24) * 100}%`, height: `${(1 / 24) * 100}%` }}
            >
              <div className="w-16 flex-shrink-0 text-xs text-gray-400 dark:text-gray-500 text-right pr-2 pt-0.5">
                {formatHour(hour)}
              </div>
              <div className="flex-1 border-l border-gray-200 dark:border-gray-700" />
            </div>
          ))}

          {/* Now indicator */}
          {nowPosition !== null && (
            <div
              className="absolute left-16 right-0 z-20 flex items-center"
              style={{ top: `${nowPosition}%` }}
            >
              <div className="w-2 h-2 rounded-full bg-red-500 -ml-1" />
              <div className="flex-1 h-px bg-red-500" />
            </div>
          )}

          {/* Timed events */}
          <div className="absolute left-16 right-2 top-0 bottom-0">
            {timedEvents.map((event) => {
              const pos = getEventPosition(event, dayStart)
              const locationLabel = getSemanticLocationLabel(event, effectiveSpatial)
              return (
                <button
                  key={event.id}
                  onClick={() => setSelectedEventId(event.id)}
                  className="absolute left-1 right-1 rounded px-2 py-1 text-left overflow-hidden hover:opacity-90 transition-opacity z-10"
                  style={{
                    top: `${pos.top}%`,
                    height: `${pos.height}%`,
                    minHeight: '20px',
                    backgroundColor: event.source_color || '#3b82f6',
                    color: '#fff',
                  }}
                >
                  <div className="text-xs font-medium truncate">{event.title}</div>
                  <div className="text-[10px] opacity-75 truncate">
                    {new Date(event.start).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                    {' - '}
                    {new Date(event.end).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                    {locationLabel && ` \u00B7 ${locationLabel}`}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Loading skeleton */}
          {isLoading && (
            <div className="absolute left-16 right-2 top-[25%] z-10">
              <div className="h-16 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mx-1" />
            </div>
          )}
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
