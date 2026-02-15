'use client'

import { X, Calendar, MapPin, ChevronDown, ChevronRight, Plus, RefreshCw, Loader2, Check, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useCalendarStore } from '@/lib/store'
import { SpatialGranularity, GRANULARITY_LABELS } from '@/lib/types'
import { useSources } from '@/hooks/useEvents'
import { syncAllSources } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'
import { clsx } from 'clsx'

interface CalendarSidebarProps {
  onClose: () => void
}

export function CalendarSidebar({ onClose }: CalendarSidebarProps) {
  const [sourcesExpanded, setSourcesExpanded] = useState(true)
  const [locationsExpanded, setLocationsExpanded] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const { currentDate, setCurrentDate, hiddenSources, toggleSourceVisibility } = useCalendarStore()
  const queryClient = useQueryClient()

  // Fetch real sources from API
  const { data: sourcesData, isLoading: sourcesLoading } = useSources()
  const sources = sourcesData?.results || []

  const handleSync = async () => {
    setIsSyncing(true)
    setSyncStatus('idle')
    try {
      const results = await syncAllSources()
      const hasErrors = results.some((r) => r.status === 'rejected')
      setSyncStatus(hasErrors ? 'error' : 'success')
      // Invalidate queries to refetch data
      await queryClient.invalidateQueries({ queryKey: ['events'] })
      await queryClient.invalidateQueries({ queryKey: ['sources'] })
    } catch {
      setSyncStatus('error')
    } finally {
      setIsSyncing(false)
      // Reset status after 3 seconds
      setTimeout(() => setSyncStatus('idle'), 3000)
    }
  }

  const locationTree = [
    {
      name: 'Earth',
      granularity: SpatialGranularity.PLANET,
      children: [
        {
          name: 'Europe',
          granularity: SpatialGranularity.CONTINENT,
          children: [
            { name: 'Germany', granularity: SpatialGranularity.COUNTRY },
            { name: 'France', granularity: SpatialGranularity.COUNTRY },
          ],
        },
        {
          name: 'North America',
          granularity: SpatialGranularity.CONTINENT,
          children: [
            { name: 'United States', granularity: SpatialGranularity.COUNTRY },
            { name: 'Canada', granularity: SpatialGranularity.COUNTRY },
          ],
        },
      ],
    },
  ]

  return (
    <aside className="w-72 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 dark:text-white">Calendars</h2>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Mini calendar */}
        <MiniCalendar />

        {/* Calendar Sources */}
        <section>
          <button
            onClick={() => setSourcesExpanded(!sourcesExpanded)}
            className="flex items-center gap-2 w-full text-left mb-2"
          >
            {sourcesExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-700 dark:text-gray-300">Sources</span>
          </button>

          {sourcesExpanded && (
            <div className="space-y-1 ml-6">
              {sourcesLoading ? (
                <div className="flex items-center gap-2 py-2 text-sm text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading sources...
                </div>
              ) : sources.length === 0 ? (
                <div className="text-sm text-gray-500 py-2">No calendars found</div>
              ) : (
                sources.map((source) => {
                  const isVisible = !hiddenSources.includes(source.id)
                  return (
                    <label key={source.id} className="flex items-center gap-2 py-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isVisible}
                        onChange={() => toggleSourceVisibility(source.id)}
                        className="rounded border-gray-300"
                        style={{ accentColor: source.color }}
                      />
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: source.color }}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate" title={source.name}>
                        {source.name}
                      </span>
                      <span className="text-xs text-gray-400">{source.event_count}</span>
                    </label>
                  )
                })
              )}

              <button className="flex items-center gap-2 py-1 text-sm text-blue-500 hover:text-blue-600">
                <Plus className="w-4 h-4" />
                Add calendar
              </button>
            </div>
          )}
        </section>

        {/* Location Filter */}
        <section>
          <button
            onClick={() => setLocationsExpanded(!locationsExpanded)}
            className="flex items-center gap-2 w-full text-left mb-2"
          >
            {locationsExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-700 dark:text-gray-300">Locations</span>
          </button>

          {locationsExpanded && (
            <div className="ml-6 space-y-1">
              <LocationTree items={locationTree} />
            </div>
          )}
        </section>

        {/* Lunar phase navigation - Phase 2 */}
      </div>

      {/* Sync button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className={clsx(
            'w-full flex items-center justify-center gap-2 py-2 px-4 text-sm rounded-lg transition-colors',
            syncStatus === 'success' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            syncStatus === 'error' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            syncStatus === 'idle' && 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700',
            isSyncing && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isSyncing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Syncing...
            </>
          ) : syncStatus === 'success' ? (
            <>
              <Check className="w-4 h-4" />
              Synced!
            </>
          ) : syncStatus === 'error' ? (
            <>
              <AlertCircle className="w-4 h-4" />
              Sync failed
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Sync all calendars
            </>
          )}
        </button>
      </div>
    </aside>
  )
}

function MiniCalendar() {
  const { currentDate, setCurrentDate, goToNextMonth, goToPreviousMonth } = useCalendarStore()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startDayOfWeek = firstDay.getDay()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const days: (number | null)[] = []

  // Empty cells before first day
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null)
  }

  // Days of month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={goToPreviousMonth}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          <ChevronDown className="w-4 h-4 rotate-90 text-gray-500" />
        </button>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </span>
        <button
          onClick={goToNextMonth}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          <ChevronDown className="w-4 h-4 -rotate-90 text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-xs text-gray-400 py-1">
            {d}
          </div>
        ))}

        {days.map((day, i) => {
          if (day === null) {
            return <div key={i} />
          }

          const d = new Date(year, month, day)
          const isToday = d.getTime() === today.getTime()
          const isSelected = d.toDateString() === currentDate.toDateString()

          return (
            <button
              key={i}
              onClick={() => setCurrentDate(d)}
              className={clsx(
                'text-xs py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700',
                isToday && 'bg-blue-500 text-white hover:bg-blue-600',
                isSelected && !isToday && 'bg-gray-200 dark:bg-gray-700'
              )}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function LocationTree({
  items,
  depth = 0,
}: {
  items: Array<{
    name: string
    granularity: SpatialGranularity
    children?: Array<{ name: string; granularity: SpatialGranularity; children?: any[] }>
  }>
  depth?: number
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  return (
    <>
      {items.map((item) => (
        <div key={item.name}>
          <button
            onClick={() =>
              setExpanded((prev) => ({ ...prev, [item.name]: !prev[item.name] }))
            }
            className="flex items-center gap-1 py-1 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white w-full text-left"
            style={{ paddingLeft: `${depth * 12}px` }}
          >
            {item.children?.length ? (
              expanded[item.name] ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )
            ) : (
              <span className="w-3" />
            )}
            <span>{item.name}</span>
            <span className="text-xs text-gray-400 ml-1">
              ({GRANULARITY_LABELS[item.granularity]})
            </span>
          </button>

          {item.children && expanded[item.name] && (
            <LocationTree items={item.children} depth={depth + 1} />
          )}
        </div>
      ))}
    </>
  )
}
