'use client'

import { useEffect, useState } from 'react'
import { Layers, Loader2, Calendar } from 'lucide-react'
import { useCalendarStore } from '@/lib/store'
import { getAdapter, getAllAdapters } from '@/lib/context-adapters'
import type { RCalEvent } from '@/lib/types'

export function ContextTab() {
  const { rCalContext } = useCalendarStore()
  const [events, setEvents] = useState<RCalEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!rCalContext) {
      setEvents([])
      return
    }

    const adapter = getAdapter(rCalContext.tool)
    if (!adapter) {
      setError(`No adapter registered for ${rCalContext.tool}`)
      return
    }

    setLoading(true)
    setError(null)
    adapter
      .fetchEvents(rCalContext)
      .then(setEvents)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [rCalContext])

  if (!rCalContext) {
    const adapters = getAllAdapters()
    return (
      <main className="h-full flex items-center justify-center p-8">
        <div className="text-center space-y-6 max-w-lg">
          <Layers className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            No context active
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Open rcal from another r* tool to view context-specific calendar data.
            The Context tab adapts its rendering based on which tool is driving it.
          </p>

          {/* Available adapters */}
          <div className="space-y-2 pt-2">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Registered adapters
            </p>
            <div className="grid gap-2">
              {adapters.map((a) => (
                <div
                  key={a.toolName}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-left"
                >
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {a.toolName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {a.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Or visit{' '}
              <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                /context?tool=rTrips&entityId=...
              </code>{' '}
              to load a context directly.
            </p>
          </div>
        </div>
      </main>
    )
  }

  const adapter = getAdapter(rCalContext.tool)

  return (
    <main className="h-full overflow-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Context header */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
          <Layers className="w-6 h-6 text-blue-500" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {adapter?.label || rCalContext.tool}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {adapter?.description}
              {rCalContext.entityId && (
                <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                  {rCalContext.entityType || 'entity'}: {rCalContext.entityId}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-12 gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading {rCalContext.tool} events...</span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Events list */}
        {!loading && !error && events.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No events found for this context.
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {events.length} event{events.length !== 1 ? 's' : ''} from {rCalContext.tool}
            </p>
            <div className="grid gap-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: event.source_color || '#6b7280' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white truncate">
                      {event.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(event.start).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                      {event.eventCategory && (
                        <span className="ml-2 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                          {event.eventCategory}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
