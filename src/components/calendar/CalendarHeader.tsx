'use client'

import { ChevronLeft, ChevronRight, Menu, Calendar, Moon, Settings, MapPin, ZoomIn, ZoomOut } from 'lucide-react'
import { useCalendarStore } from '@/lib/store'
import { TemporalGranularity, TEMPORAL_GRANULARITY_LABELS } from '@/lib/types'
import { clsx } from 'clsx'
import { AppSwitcher } from '@/components/AppSwitcher'

interface CalendarHeaderProps {
  onToggleSidebar: () => void
  sidebarOpen: boolean
}

export function CalendarHeader({ onToggleSidebar, sidebarOpen }: CalendarHeaderProps) {
  const {
    currentDate,
    goToToday,
    navigateByGranularity,
    temporalGranularity,
    setTemporalGranularity,
    zoomIn,
    zoomOut,
    showLunarOverlay,
    setShowLunarOverlay,
  } = useCalendarStore()

  // Format the display based on temporal granularity
  const getDateDisplay = () => {
    switch (temporalGranularity) {
      case TemporalGranularity.DECADE: {
        const decadeStart = Math.floor(currentDate.getFullYear() / 10) * 10
        return `${decadeStart}--${decadeStart + 9}`
      }
      case TemporalGranularity.YEAR:
        return currentDate.getFullYear().toString()
      case TemporalGranularity.MONTH:
        return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      case TemporalGranularity.WEEK: {
        const weekStart = new Date(currentDate)
        weekStart.setDate(currentDate.getDate() - currentDate.getDay())
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -- ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
      }
      case TemporalGranularity.DAY:
        return currentDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      default:
        return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }
  }

  const currentDisplay = getDateDisplay()

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <AppSwitcher current="cal" />

          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white hidden sm:block">
              rCal
            </h1>
          </div>
        </div>

        {/* Center section - navigation */}
        <div className="flex items-center gap-2">
          {/* Zoom out button */}
          <button
            onClick={zoomOut}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Zoom out (-)"
          >
            <ZoomOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>

          <button
            onClick={() => navigateByGranularity('prev')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={`Previous ${TEMPORAL_GRANULARITY_LABELS[temporalGranularity]}`}
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"
          >
            Today
          </button>

          <div className="flex flex-col items-center min-w-[200px]">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentDisplay}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {TEMPORAL_GRANULARITY_LABELS[temporalGranularity]} view
            </span>
          </div>

          <button
            onClick={() => navigateByGranularity('next')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={`Next ${TEMPORAL_GRANULARITY_LABELS[temporalGranularity]}`}
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Zoom in button */}
          <button
            onClick={zoomIn}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Zoom in (+)"
          >
            <ZoomIn className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Right section - settings */}
        <div className="flex items-center gap-3">
          {/* Show lunar overlay toggle */}
          <button
            onClick={() => setShowLunarOverlay(!showLunarOverlay)}
            className={clsx(
              'p-2 rounded-lg transition-colors',
              showLunarOverlay
                ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            )}
            title={showLunarOverlay ? 'Hide lunar overlay' : 'Show lunar overlay'}
          >
            <Moon className="w-5 h-5" />
          </button>

          {/* Location filter */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
            title="Filter by location"
          >
            <MapPin className="w-5 h-5" />
          </button>

          {/* Settings */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
