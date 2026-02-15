'use client'

import { useMemo, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useCalendarStore } from '@/lib/store'
import { TemporalGranularity } from '@/lib/types'
import { clsx } from 'clsx'

type ViewMode = 'compact' | 'glance'

// Vibrant month colors for Gregorian calendar
const MONTH_COLORS = [
  '#3B82F6', // January - Blue
  '#EC4899', // February - Pink
  '#10B981', // March - Emerald
  '#F59E0B', // April - Amber
  '#84CC16', // May - Lime
  '#F97316', // June - Orange
  '#EF4444', // July - Red
  '#8B5CF6', // August - Violet
  '#14B8A6', // September - Teal
  '#D97706', // October - Amber Dark
  '#A855F7', // November - Purple
  '#0EA5E9', // December - Sky Blue
]

// Compact mini-month for the grid overview
interface MiniMonthProps {
  year: number
  month: number
  isCurrentMonth: boolean
  onMonthClick: (month: number) => void
  eventCounts?: Record<number, number>
}

function MiniMonth({
  year,
  month,
  isCurrentMonth,
  onMonthClick,
  eventCounts = {},
}: MiniMonthProps) {
  const monthData = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    const daysInMonth = lastDay.getDate()
    const startDay = firstDay.getDay()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const days: { day: number; isToday: boolean }[] = []
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day)
      days.push({
        day,
        isToday: date.getTime() === today.getTime(),
      })
    }
    return { days, startDay }
  }, [year, month])

  const monthName = new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short' })
  const monthColor = MONTH_COLORS[month - 1]

  const maxEvents = Math.max(...Object.values(eventCounts), 1)
  const getHeatColor = (count: number) => {
    if (count === 0) return undefined
    const intensity = Math.min(count / maxEvents, 1)
    return `rgba(59, 130, 246, ${0.2 + intensity * 0.6})`
  }

  return (
    <div
      onClick={() => onMonthClick(month)}
      className={clsx(
        'p-2 rounded-lg cursor-pointer transition-all duration-200',
        'hover:scale-105 hover:shadow-lg',
        isCurrentMonth
          ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
      )}
      style={{
        borderTop: `3px solid ${monthColor}`,
      }}
    >
      <div
        className="text-xs font-semibold mb-1 text-center"
        style={{ color: monthColor }}
      >
        {monthName}
      </div>

      <div className="grid grid-cols-7 gap-px mb-0.5">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={`${month}-header-${i}`} className="text-[8px] text-gray-400 text-center">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px">
        {Array.from({ length: monthData.startDay }).map((_, i) => (
          <div key={`${month}-empty-${i}`} className="w-4 h-4" />
        ))}

        {monthData.days.map(({ day, isToday }) => {
          const eventCount = eventCounts[day] || 0
          return (
            <div
              key={`${month}-day-${day}`}
              className={clsx(
                'w-4 h-4 text-[9px] flex items-center justify-center rounded-sm',
                isToday
                  ? 'bg-blue-500 text-white font-bold'
                  : 'text-gray-600 dark:text-gray-400'
              )}
              style={{
                backgroundColor: isToday ? undefined : getHeatColor(eventCount),
              }}
              title={eventCount > 0 ? `${eventCount} event${eventCount > 1 ? 's' : ''}` : undefined}
            >
              {day}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Convert Sunday=0 to Monday=0 indexing
function toMondayFirst(dayOfWeek: number): number {
  return dayOfWeek === 0 ? 6 : dayOfWeek - 1
}

// Weekday labels starting with Monday
const WEEKDAY_LABELS_MONDAY_FIRST = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

// Glance-style vertical month column - FULLSCREEN version with weekday alignment
interface GlanceMonthColumnProps {
  year: number
  month: number
  onDayClick?: (date: Date) => void
}

type CalendarSlot = {
  type: 'day'
  day: number
  date: Date
  isToday: boolean
  dayOfWeek: number // Monday=0, Sunday=6
} | {
  type: 'empty'
  dayOfWeek: number
}

function GlanceMonthColumn({ year, month, onDayClick }: GlanceMonthColumnProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Build a grid aligned by weekday
  const calendarGrid = useMemo(() => {
    const slots: CalendarSlot[] = []

    // Gregorian: Variable days, variable start day
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    const daysInMonth = lastDay.getDate()
    const startDayOfWeek = toMondayFirst(firstDay.getDay())

    // Add empty slots before the 1st
    for (let i = 0; i < startDayOfWeek; i++) {
      slots.push({ type: 'empty', dayOfWeek: i })
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day)
      slots.push({
        type: 'day',
        day,
        date,
        isToday: date.getTime() === today.getTime(),
        dayOfWeek: toMondayFirst(date.getDay()),
      })
    }

    // Pad to complete the final week (to 35 or 42 slots for 5-6 weeks)
    const targetSlots = slots.length <= 35 ? 35 : 42
    while (slots.length < targetSlots) {
      slots.push({ type: 'empty', dayOfWeek: slots.length % 7 })
    }

    return slots
  }, [year, month, today])

  const monthName = new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short' })
  const monthColor = MONTH_COLORS[month - 1]

  return (
    <div className="flex flex-col flex-1 min-w-[7rem]">
      {/* Month header */}
      <div
        className="text-center py-2 font-bold text-white flex-shrink-0"
        style={{ backgroundColor: monthColor }}
      >
        <div className="text-base">{monthName}</div>
      </div>

      {/* Days grid - aligned by weekday */}
      <div
        className="flex-1 flex flex-col border-x border-b overflow-hidden"
        style={{ borderColor: `${monthColor}40` }}
      >
        {calendarGrid.map((slot, idx) => {
          const isWeekend = slot.dayOfWeek >= 5 // Saturday=5, Sunday=6
          const isSunday = slot.dayOfWeek === 6
          const isMonday = slot.dayOfWeek === 0

          if (slot.type === 'empty') {
            return (
              <div
                key={`empty-${idx}`}
                className={clsx(
                  'flex-1 min-h-[1.25rem] w-full flex items-center gap-2 px-2 border-b last:border-b-0',
                  isSunday && 'bg-red-50/50 dark:bg-red-900/10',
                  isWeekend && !isSunday && 'bg-blue-50/50 dark:bg-blue-900/10',
                  !isWeekend && 'bg-gray-50 dark:bg-gray-800/50',
                  isMonday && 'border-t-2 border-t-gray-200 dark:border-t-gray-600'
                )}
                style={{ borderColor: `${monthColor}20` }}
              >
                <span className="text-[10px] font-medium w-5 flex-shrink-0 text-gray-300 dark:text-gray-600">
                  {WEEKDAY_LABELS_MONDAY_FIRST[slot.dayOfWeek]}
                </span>
              </div>
            )
          }

          return (
            <button
              key={slot.day}
              onClick={() => onDayClick?.(slot.date)}
              className={clsx(
                'flex-1 min-h-[1.25rem] w-full flex items-center gap-2 px-2 transition-all',
                'hover:brightness-95 border-b last:border-b-0',
                slot.isToday && 'ring-2 ring-inset font-bold',
                isSunday && !slot.isToday && 'bg-red-50 dark:bg-red-900/20',
                isWeekend && !isSunday && !slot.isToday && 'bg-blue-50 dark:bg-blue-900/20',
                !isWeekend && !slot.isToday && 'bg-white dark:bg-gray-900',
                isMonday && 'border-t-2 border-t-gray-200 dark:border-t-gray-600'
              )}
              style={{
                borderColor: `${monthColor}20`,
                ...(slot.isToday && {
                  backgroundColor: monthColor,
                  color: 'white',
                  ringColor: 'white',
                }),
              }}
            >
              <span className={clsx(
                'text-[10px] font-medium w-5 flex-shrink-0',
                isSunday && !slot.isToday && 'text-red-500',
                isWeekend && !isSunday && !slot.isToday && 'text-blue-500',
                !isWeekend && !slot.isToday && 'text-gray-400 dark:text-gray-500'
              )}>
                {WEEKDAY_LABELS_MONDAY_FIRST[slot.dayOfWeek]}
              </span>
              <span className={clsx(
                'text-sm font-semibold w-5 flex-shrink-0',
                !slot.isToday && 'text-gray-800 dark:text-gray-200'
              )}>
                {slot.day}
              </span>
              {/* Space for events/location */}
              <span className="flex-1 text-xs text-gray-500 dark:text-gray-400 truncate text-left">
                {/* Future: event/location info here */}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Fullscreen Glance View Portal
interface FullscreenGlanceProps {
  year: number
  onDayClick: (date: Date) => void
  onClose: () => void
  navigatePrev: () => void
  navigateNext: () => void
}

function FullscreenGlance({
  year,
  onDayClick,
  onClose,
  navigatePrev,
  navigateNext,
}: FullscreenGlanceProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Handle escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        navigatePrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        navigateNext()
      }
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, navigatePrev, navigateNext])

  if (!mounted) return null

  const content = (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 flex-shrink-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={navigatePrev}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Previous year"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {year}
          </h1>
          <button
            onClick={navigateNext}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Next year"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full">
            Gregorian Calendar
          </span>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
          title="Exit fullscreen (Esc)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Exit Fullscreen
        </button>
      </div>

      {/* Month columns - takes up remaining space */}
      <div className="flex-1 flex gap-1 p-3 overflow-x-auto min-h-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <GlanceMonthColumn
            key={i + 1}
            year={year}
            month={i + 1}
            onDayClick={onDayClick}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 dark:text-gray-400 py-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur flex-shrink-0">
        Click any day to zoom in • Arrow keys navigate years • Esc to exit • T for today
      </div>
    </div>
  )

  return createPortal(content, document.body)
}

export function YearView() {
  const [viewMode, setViewMode] = useState<ViewMode>('glance')
  const {
    currentDate,
    setCurrentDate,
    setViewType,
    setTemporalGranularity,
    navigateByGranularity,
  } = useCalendarStore()

  const year = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  const handleMonthClick = (month: number) => {
    setCurrentDate(new Date(year, month - 1, 1))
    setTemporalGranularity(TemporalGranularity.MONTH)
    setViewType('month')
  }

  const handleDayClick = (date: Date) => {
    setCurrentDate(date)
    setTemporalGranularity(TemporalGranularity.DAY)
  }

  const months = 12

  // Mock event counts for compact view
  const mockEventCounts = useMemo(() => {
    const counts: Record<number, Record<number, number>> = {}
    for (let m = 1; m <= months; m++) {
      counts[m] = {}
      for (let d = 1; d <= 28; d++) {
        if (Math.random() > 0.7) {
          counts[m][d] = Math.floor(Math.random() * 5) + 1
        }
      }
    }
    return counts
  }, [months])

  // Glance mode uses fullscreen portal
  if (viewMode === 'glance') {
    return (
      <>
        {/* Placeholder in normal flow */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <div className="text-lg font-medium mb-2">Glance View Active</div>
            <div className="text-sm">Fullscreen calendar is displayed. Press Esc to return.</div>
          </div>
        </div>

        {/* Fullscreen portal */}
        <FullscreenGlance
          year={year}
          onDayClick={handleDayClick}
          onClose={() => setViewMode('compact')}
          navigatePrev={() => navigateByGranularity('prev')}
          navigateNext={() => navigateByGranularity('next')}
        />
      </>
    )
  }

  // Compact view - traditional grid layout
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Year header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {year}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Gregorian Calendar
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode('compact')}
            className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors bg-white dark:bg-gray-600 shadow-sm"
          >
            Compact
          </button>
          <button
            onClick={() => setViewMode('glance')}
            className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            Fullscreen
          </button>
        </div>
      </div>

      {/* Month grid */}
      <div className="p-4">
        <div className="grid gap-3 grid-cols-4 md:grid-cols-6">
          {Array.from({ length: months }).map((_, i) => {
            const month = i + 1
            const isCurrentMonthView = currentMonth === month && currentDate.getFullYear() === year

            return (
              <MiniMonth
                key={`month-${month}`}
                year={year}
                month={month}
                isCurrentMonth={isCurrentMonthView}
                onMonthClick={handleMonthClick}
                eventCounts={mockEventCounts[month]}
              />
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" />
            <span>Current month</span>
          </div>
        </div>
        <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-2">
          Click any month to zoom in • Click &quot;Fullscreen&quot; for year-at-a-glance
        </p>
      </div>
    </div>
  )
}
