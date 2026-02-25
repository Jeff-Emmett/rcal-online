'use client'

import { useMemo } from 'react'
import { useCalendarStore } from '@/lib/store'
import { TemporalGranularity } from '@/lib/types'
import { clsx } from 'clsx'

interface MonthGridProps {
  year: number
  month: number // 1-indexed
  onDayClick?: (date: Date) => void
}

function MonthGrid({ year, month, onDayClick }: MonthGridProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const monthData = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    const daysInMonth = lastDay.getDate()
    const startDay = firstDay.getDay()

    const days: { day: number; date: Date; isToday: boolean }[] = []
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day)
      days.push({
        day,
        date,
        isToday: date.getTime() === today.getTime(),
      })
    }
    return { days, startDay, daysInMonth }
  }, [year, month, today])

  const monthName = new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long' })

  return (
    <div className="flex-1 min-w-0">
      {/* Month header */}
      <div
        className="text-center py-2 rounded-t-lg font-semibold"
        style={{
          backgroundColor: 'rgb(243 244 246)',
          color: 'rgb(55 65 81)',
        }}
      >
        {monthName}
      </div>

      {/* Calendar grid */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-800">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div
              key={i}
              className={clsx(
                'text-center text-xs py-1 font-medium',
                i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-500'
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7">
          {/* Empty cells for start offset */}
          {Array.from({ length: monthData.startDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square border-t border-l border-gray-100 dark:border-gray-700" />
          ))}

          {/* Day cells */}
          {monthData.days.map(({ day, date, isToday }) => (
            <button
              key={day}
              onClick={() => onDayClick?.(date)}
              className={clsx(
                'aspect-square flex items-center justify-center text-sm',
                'border-t border-l border-gray-100 dark:border-gray-700',
                'hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                isToday && 'bg-blue-500 text-white font-bold hover:bg-blue-600'
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SeasonView() {
  const {
    currentDate,
    setCurrentDate,
    setTemporalGranularity,
  } = useCalendarStore()

  const year = currentDate.getFullYear()

  // Determine current quarter
  const currentMonth = currentDate.getMonth() + 1
  const currentQuarter = Math.ceil(currentMonth / 3)

  // Get the months for this quarter
  const quarterMonths = useMemo(() => {
    const startMonth = (currentQuarter - 1) * 3 + 1
    return [startMonth, startMonth + 1, startMonth + 2]
  }, [currentQuarter])

  const seasonName = ['Winter', 'Spring', 'Summer', 'Fall'][currentQuarter - 1] || 'Quarter'

  const handleDayClick = (date: Date) => {
    setCurrentDate(date)
    setTemporalGranularity(TemporalGranularity.DAY)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      {/* Season header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
          {seasonName} {year}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
          Q{currentQuarter} • Gregorian •{' '}
          {quarterMonths.length} months
        </p>
      </div>

      {/* Three month grid */}
      <div className="flex-1 overflow-auto p-4">
        <div className="flex gap-4 h-full">
          {quarterMonths.map((month) => (
            <MonthGrid
              key={month}
              year={year}
              month={month}
              onDayClick={handleDayClick}
            />
          ))}
        </div>
      </div>

      {/* Navigation hint */}
      <div className="px-4 pb-3 pt-1 flex-shrink-0">
        <p className="text-xs text-center text-gray-400 dark:text-gray-500">
          Click any day to zoom in • Use arrow keys to navigate quarters
        </p>
      </div>
    </div>
  )
}
