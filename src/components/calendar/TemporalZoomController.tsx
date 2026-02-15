'use client'

import { useCallback, useEffect } from 'react'
import { useCalendarStore, useEffectiveSpatialGranularity } from '@/lib/store'
import { TemporalGranularity, TEMPORAL_GRANULARITY_LABELS, SpatialGranularity, GRANULARITY_LABELS } from '@/lib/types'
import { Link2, Unlink2 } from 'lucide-react'
import { clsx } from 'clsx'

// Zoom levels we support in the UI
const ZOOM_LEVELS: TemporalGranularity[] = [
  TemporalGranularity.DAY,
  TemporalGranularity.WEEK,
  TemporalGranularity.MONTH,
  TemporalGranularity.SEASON,
  TemporalGranularity.YEAR,
  TemporalGranularity.DECADE,
]

// Spatial levels for the filter (when uncoupled)
const SPATIAL_LEVELS: SpatialGranularity[] = [
  SpatialGranularity.PLANET,
  SpatialGranularity.CONTINENT,
  SpatialGranularity.COUNTRY,
  SpatialGranularity.CITY,
]

interface TemporalZoomControllerProps {
  showSpatial?: boolean
  compact?: boolean
}

export function TemporalZoomController({
  showSpatial = true,
  compact = false,
}: TemporalZoomControllerProps) {
  const {
    temporalGranularity,
    setTemporalGranularity,
    zoomIn,
    zoomOut,
    spatialGranularity,
    setSpatialGranularity,
    navigateByGranularity,
    goToToday,
    currentDate,
    zoomCoupled,
    toggleZoomCoupled,
  } = useCalendarStore()
  const effectiveSpatial = useEffectiveSpatialGranularity()

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key) {
        case '+':
        case '=':
          e.preventDefault()
          zoomIn()
          break
        case '-':
        case '_':
          e.preventDefault()
          zoomOut()
          break
        case 'ArrowLeft':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault()
            navigateByGranularity('prev')
          }
          break
        case 'ArrowRight':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault()
            navigateByGranularity('next')
          }
          break
        case 't':
        case 'T':
          e.preventDefault()
          goToToday()
          break
        case '1':
          e.preventDefault()
          setTemporalGranularity(TemporalGranularity.DAY)
          break
        case '2':
          e.preventDefault()
          setTemporalGranularity(TemporalGranularity.WEEK)
          break
        case '3':
          e.preventDefault()
          setTemporalGranularity(TemporalGranularity.MONTH)
          break
        case '4':
          e.preventDefault()
          setTemporalGranularity(TemporalGranularity.SEASON)
          break
        case '5':
          e.preventDefault()
          setTemporalGranularity(TemporalGranularity.YEAR)
          break
        case '6':
          e.preventDefault()
          setTemporalGranularity(TemporalGranularity.DECADE)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [zoomIn, zoomOut, navigateByGranularity, goToToday, setTemporalGranularity])

  // Wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        if (e.deltaY < 0) {
          zoomIn()
        } else {
          zoomOut()
        }
      }
    },
    [zoomIn, zoomOut]
  )

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  const currentZoomIndex = ZOOM_LEVELS.indexOf(temporalGranularity)
  const canZoomIn = currentZoomIndex > 0
  const canZoomOut = currentZoomIndex < ZOOM_LEVELS.length - 1

  // Format current date based on granularity
  const formatDate = () => {
    const d = currentDate
    switch (temporalGranularity) {
      case TemporalGranularity.DAY:
        return d.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      case TemporalGranularity.WEEK:
        const weekStart = new Date(d)
        weekStart.setDate(d.getDate() - d.getDay())
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
      case TemporalGranularity.MONTH:
        return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      case TemporalGranularity.YEAR:
        return d.getFullYear().toString()
      case TemporalGranularity.DECADE:
        const decadeStart = Math.floor(d.getFullYear() / 10) * 10
        return `${decadeStart}s`
      default:
        return d.toLocaleDateString()
    }
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {/* Zoom buttons */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg">
          <button
            onClick={zoomIn}
            disabled={!canZoomIn}
            className={clsx(
              'px-2 py-1 text-sm rounded-l-lg transition-colors',
              canZoomIn
                ? 'hover:bg-gray-200 dark:hover:bg-gray-600'
                : 'opacity-50 cursor-not-allowed'
            )}
            title="Zoom in (+ or Ctrl+Scroll)"
          >
            +
          </button>
          <span className="px-2 text-xs font-medium text-gray-600 dark:text-gray-300">
            {TEMPORAL_GRANULARITY_LABELS[temporalGranularity]}
          </span>
          <button
            onClick={zoomOut}
            disabled={!canZoomOut}
            className={clsx(
              'px-2 py-1 text-sm rounded-r-lg transition-colors',
              canZoomOut
                ? 'hover:bg-gray-200 dark:hover:bg-gray-600'
                : 'opacity-50 cursor-not-allowed'
            )}
            title="Zoom out (- or Ctrl+Scroll)"
          >
            −
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      {/* Header with current context */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatDate()}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Viewing: {TEMPORAL_GRANULARITY_LABELS[temporalGranularity]}
          </p>
        </div>
        <button
          onClick={goToToday}
          className="px-3 py-1.5 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Today
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateByGranularity('prev')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Previous (←)"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            ← Previous / Next →
          </span>
        </div>

        <button
          onClick={() => navigateByGranularity('next')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Next (→)"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Temporal Zoom Slider */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Temporal Granularity
        </label>
        <div className="relative">
          {/* Track */}
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              className="h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all"
              style={{
                width: `${((currentZoomIndex + 1) / ZOOM_LEVELS.length) * 100}%`,
              }}
            />
          </div>

          {/* Tick marks */}
          <div className="flex justify-between mt-1">
            {ZOOM_LEVELS.map((level, i) => (
              <button
                key={level}
                onClick={() => setTemporalGranularity(level)}
                className={clsx(
                  'flex flex-col items-center transition-all',
                  temporalGranularity === level
                    ? 'text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                )}
              >
                <div
                  className={clsx(
                    'w-3 h-3 rounded-full border-2 -mt-2.5 bg-white dark:bg-gray-800 transition-all',
                    temporalGranularity === level
                      ? 'border-blue-500 scale-125'
                      : 'border-gray-300 dark:border-gray-600'
                  )}
                />
                <span className="text-xs mt-1">{TEMPORAL_GRANULARITY_LABELS[level]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Zoom buttons */}
        <div className="flex items-center justify-center gap-4 mt-3">
          <button
            onClick={zoomIn}
            disabled={!canZoomIn}
            className={clsx(
              'flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors',
              canZoomIn
                ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                : 'bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            )}
          >
            <span className="text-lg">+</span>
            <span>More Detail</span>
          </button>
          <button
            onClick={zoomOut}
            disabled={!canZoomOut}
            className={clsx(
              'flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors',
              canZoomOut
                ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                : 'bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            )}
          >
            <span className="text-lg">−</span>
            <span>Less Detail</span>
          </button>
        </div>
      </div>

      {/* Coupling toggle */}
      {showSpatial && (
        <div className="flex items-center justify-center my-3">
          <button
            onClick={toggleZoomCoupled}
            className={clsx(
              'flex items-center gap-2 px-3 py-1.5 text-xs rounded-full transition-colors border',
              zoomCoupled
                ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500'
            )}
            title={zoomCoupled ? 'Unlink spatial from temporal zoom (L)' : 'Link spatial to temporal zoom (L)'}
          >
            {zoomCoupled ? <Link2 className="w-3.5 h-3.5" /> : <Unlink2 className="w-3.5 h-3.5" />}
            {zoomCoupled ? 'Zoom Coupled' : 'Zoom Independent'}
          </button>
        </div>
      )}

      {/* Spatial Granularity */}
      {showSpatial && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Spatial Granularity
          </label>

          {zoomCoupled ? (
            <div className="text-sm text-gray-500 dark:text-gray-400 px-1">
              Auto: <span className="font-medium text-green-600 dark:text-green-400">{GRANULARITY_LABELS[effectiveSpatial]}</span>
              <span className="text-xs ml-1">(driven by temporal zoom)</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSpatialGranularity(null)}
                className={clsx(
                  'px-3 py-1.5 text-xs rounded-full transition-colors',
                  spatialGranularity === null
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                All Locations
              </button>
              {SPATIAL_LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => setSpatialGranularity(level)}
                  className={clsx(
                    'px-3 py-1.5 text-xs rounded-full transition-colors',
                    spatialGranularity === level
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  )}
                >
                  {GRANULARITY_LABELS[level]}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          Keyboard: <kbd className="px-1 bg-gray-100 dark:bg-gray-700 rounded">+</kbd>/<kbd className="px-1 bg-gray-100 dark:bg-gray-700 rounded">-</kbd> zoom •{' '}
          <kbd className="px-1 bg-gray-100 dark:bg-gray-700 rounded">←</kbd>/<kbd className="px-1 bg-gray-100 dark:bg-gray-700 rounded">→</kbd> navigate •{' '}
          <kbd className="px-1 bg-gray-100 dark:bg-gray-700 rounded">t</kbd> today •{' '}
          <kbd className="px-1 bg-gray-100 dark:bg-gray-700 rounded">1-6</kbd> granularity •{' '}
          <kbd className="px-1 bg-gray-100 dark:bg-gray-700 rounded">m</kbd> map •{' '}
          <kbd className="px-1 bg-gray-100 dark:bg-gray-700 rounded">l</kbd> link
        </p>
      </div>
    </div>
  )
}
