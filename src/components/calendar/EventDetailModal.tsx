'use client'

import { X, MapPin, Calendar, Clock, Video, Users, ExternalLink, Repeat } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getEvent } from '@/lib/api'
import { getSemanticLocationLabel } from '@/lib/location'
import type { UnifiedEvent } from '@/lib/types'
import { useEffectiveSpatialGranularity } from '@/lib/store'
import { clsx } from 'clsx'

interface EventDetailModalProps {
  eventId: string
  onClose: () => void
}

export function EventDetailModal({ eventId, onClose }: EventDetailModalProps) {
  const { data: event, isLoading, error } = useQuery<UnifiedEvent>({
    queryKey: ['event', eventId],
    queryFn: () => getEvent(eventId) as Promise<UnifiedEvent>,
  })
  const effectiveSpatial = useEffectiveSpatialGranularity()

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Color bar */}
        {event && (
          <div
            className="h-2"
            style={{ backgroundColor: event.source_color }}
          />
        )}

        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1 pr-4">
            {isLoading ? (
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
            ) : error ? (
              <span className="text-red-500">Error loading event</span>
            ) : (
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {event?.title}
              </h2>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-auto max-h-[calc(90vh-120px)] space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
            </div>
          ) : event ? (
            <>
              {/* Date & Time */}
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-gray-900 dark:text-white">
                    {formatDate(event.start)}
                  </div>
                  {!event.all_day && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {formatTime(event.start)} – {formatTime(event.end)}
                      <span className="text-gray-400">
                        ({formatDuration(event.duration_minutes)})
                      </span>
                    </div>
                  )}
                  {event.all_day && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">All day</span>
                  )}
                </div>
              </div>

              {/* Lunar phase display - Phase 2 */}

              {/* Recurring */}
              {event.is_recurring && event.rrule && (
                <div className="flex items-start gap-3">
                  <Repeat className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Recurring event
                  </div>
                </div>
              )}

              {/* Location */}
              {(event.location_raw || event.is_virtual) && (
                <div className="flex items-start gap-3">
                  {event.is_virtual ? (
                    <Video className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    {event.location_raw && (() => {
                      const semanticLabel = getSemanticLocationLabel(event, effectiveSpatial)
                      return (
                        <>
                          <div className="text-gray-900 dark:text-white">
                            {semanticLabel || event.location_raw}
                          </div>
                          {semanticLabel && semanticLabel !== event.location_raw && (
                            <div className="text-xs text-gray-400 mt-0.5">{event.location_raw}</div>
                          )}
                        </>
                      )
                    })()}
                    {event.is_virtual && event.virtual_url && (
                      <a
                        href={event.virtual_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                      >
                        {event.virtual_platform || 'Join meeting'}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Attendees */}
              {event.attendee_count > 0 && (
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {event.attendee_count} attendee{event.attendee_count !== 1 ? 's' : ''}
                    </div>
                    {event.organizer_name && (
                      <div className="text-xs text-gray-500">
                        Organized by {event.organizer_name}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {event.description && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div
                    className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: event.description }}
                  />
                </div>
              )}

              {/* Source badge */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: event.source_color }}
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {event.source_name}
                  </span>
                </div>
                <span
                  className={clsx(
                    'text-xs px-2 py-0.5 rounded',
                    event.status === 'confirmed' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                    event.status === 'tentative' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                    event.status === 'cancelled' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  )}
                >
                  {event.status}
                </span>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
