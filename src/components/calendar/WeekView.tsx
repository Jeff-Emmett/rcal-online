'use client'

import { useMemo } from 'react'
import { useCalendarStore, useEffectiveSpatialGranularity } from '@/lib/store'
import { getSemanticLocationLabel } from '@/lib/location'
import { useMonthEvents } from '@/hooks/useEvents'
import { TemporalGranularity } from '@/lib/types'
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

function getWeekDays(date: Date): Date[] {
  const start = new Date(date)
  start.setDate(date.getDate() - date.getDay()) // Start on Sunday
  start.setHours(0, 0, 0, 0)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

function getEventPosition(event: EventListItem, dayStart: Date) {
  const start = new Date(event.start)
  const end = new Date(event.end)
  const dayEnd = new Date(dayStart)
  dayEnd.setHours(23, 59, 59, 999)

  const effectiveStart = start < dayStart ? dayStart : start
  const effectiveEnd = end > dayEnd ? dayEnd : end

  const startMinutes = effectiveStart.getHours() * 60 + effectiveStart.getMinutes()
  const endMinutes = effectiveEnd.getHours() * 60 + effectiveEnd.getMinutes()
  const duration = Math.max(endMinutes - startMinutes, 30)

  return {
    top: (startMinutes / (24 * 60)) * 100,
    height: (duration / (24 * 60)) * 100,
  }
}

export function WeekView() {
  const {
    currentDate,
    selectedEventId,
    setSelectedEventId,
    setCurrentDate,
    setTemporalGranularity,
    hiddenSources,
  } = useCalendarStore()
  const effectiveSpatial = useEffectiveSpatialGranularity()

  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  // We may need events from adjacent months if the week spans months
  const { data: eventsData, isLoading } = useMonthEvents(year, month)

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const nowPosition = useMemo(() => {
    const now = new Date()
    const minutes = now.getHours() * 60 + now.getMinutes()
    return (minutes / (24 * 60)) * 100
  }, [])

  // Group events by day key
  const eventsByDay = useMemo(() => {
    const map = new Map<string, { allDay: EventListItem[]; timed: EventListItem[] }>()
    if (!eventsData?.results) return map

    for (const event of eventsData.results) {
      if (hiddenSources.includes(event.source)) continue

      for (const day of weekDays) {
        const dayKey = day.toISOString().split('T')[0]
        const eventStart = new Date(event.start).toISOString().split('T')[0]
        const eventEnd = new Date(event.end).toISOString().split('T')[0]

        if (eventStart <= dayKey && eventEnd >= dayKey) {
          if (!map.has(dayKey)) map.set(dayKey, { allDay: [], timed: [] })
          const bucket = map.get(dayKey)!
          if (event.all_day) {
            if (!bucket.allDay.find((e) => e.id === event.id)) bucket.allDay.push(event)
          } else {
            if (!bucket.timed.find((e) => e.id === event.id)) bucket.timed.push(event)
          }
        }
      }
    }
    return map
  }, [eventsData?.results, weekDays, hiddenSources])

  const hasAllDayEvents = useMemo(
    () => Array.from(eventsByDay.values()).some((d) => d.allDay.length > 0),
    [eventsByDay]
  )

  const handleDayClick = (date: Date) => {
    setCurrentDate(date)
    setTemporalGranularity(TemporalGranularity.DAY)
  }

  const weekRange = `${weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} \u2013 ${weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Week header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{weekRange}</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Week {Math.ceil((currentDate.getDate() + new Date(year, month - 1, 1).getDay()) / 7)}
          </span>
        </div>
      </div>

      {/* Day headers */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        {/* Spacer for time column */}
        <div className="w-16 flex-shrink-0" />

        {weekDays.map((day) => {
          const isToday = day.getTime() === today.getTime()
          const dayKey = day.toISOString().split('T')[0]

          return (
            <button
              key={dayKey}
              onClick={() => handleDayClick(day)}
              className={clsx(
                'flex-1 py-2 text-center border-l border-gray-200 dark:border-gray-700 transition-colors',
                'hover:bg-gray-50 dark:hover:bg-gray-700/50',
                isToday && 'bg-blue-50 dark:bg-blue-900/20'
              )}
            >
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div
                className={clsx(
                  'text-lg font-semibold',
                  isToday
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-900 dark:text-white'
                )}
              >
                {day.getDate()}
              </div>
            </button>
          )
        })}
      </div>

      {/* All-day events row */}
      {hasAllDayEvents && (
        <div className="flex border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="w-16 flex-shrink-0 text-xs text-gray-400 text-right pr-2 py-1">
            All day
          </div>
          {weekDays.map((day) => {
            const dayKey = day.toISOString().split('T')[0]
            const dayEvents = eventsByDay.get(dayKey)
            return (
              <div
                key={`allday-${dayKey}`}
                className="flex-1 border-l border-gray-200 dark:border-gray-700 p-0.5 min-h-[28px]"
              >
                {dayEvents?.allDay.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEventId(event.id)}
                    className="block w-full text-[10px] px-1 py-0.5 rounded truncate hover:opacity-80 transition-opacity mb-0.5"
                    style={{
                      backgroundColor: event.source_color || '#3b82f6',
                      color: '#fff',
                    }}
                  >
                    {event.title}
                  </button>
                ))}
              </div>
            )
          })}
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
              <div className="flex-1 flex">
                {weekDays.map((day) => (
                  <div
                    key={day.toISOString()}
                    className="flex-1 border-l border-gray-200 dark:border-gray-700"
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Now indicator */}
          {weekDays.some((d) => d.getTime() === today.getTime()) && (
            <div
              className="absolute left-16 right-0 z-20 flex items-center pointer-events-none"
              style={{ top: `${nowPosition}%` }}
            >
              <div className="w-2 h-2 rounded-full bg-red-500 -ml-1" />
              <div className="flex-1 h-px bg-red-500" />
            </div>
          )}

          {/* Events overlay */}
          <div className="absolute left-16 right-0 top-0 bottom-0 flex">
            {weekDays.map((day, colIdx) => {
              const dayKey = day.toISOString().split('T')[0]
              const dayEvents = eventsByDay.get(dayKey)
              const dayStart = new Date(day)
              dayStart.setHours(0, 0, 0, 0)

              return (
                <div
                  key={dayKey}
                  className="flex-1 relative border-l border-gray-200 dark:border-gray-700"
                >
                  {dayEvents?.timed.map((event) => {
                    const pos = getEventPosition(event, dayStart)
                    const locationLabel = getSemanticLocationLabel(event, effectiveSpatial)
                    return (
                      <button
                        key={event.id}
                        onClick={() => setSelectedEventId(event.id)}
                        className="absolute left-0.5 right-0.5 rounded px-1 py-0.5 text-left overflow-hidden hover:opacity-90 transition-opacity z-10"
                        style={{
                          top: `${pos.top}%`,
                          height: `${pos.height}%`,
                          minHeight: '18px',
                          backgroundColor: event.source_color || '#3b82f6',
                          color: '#fff',
                        }}
                      >
                        <div className="text-[10px] font-medium truncate">{event.title}</div>
                        <div className="text-[9px] opacity-75 truncate">
                          {new Date(event.start).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="absolute left-16 right-0 top-[25%] z-10 flex gap-1 px-1">
              {weekDays.map((_, i) => (
                <div key={i} className="flex-1 h-12 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
              ))}
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
