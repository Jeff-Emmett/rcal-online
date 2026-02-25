'use client'

import { useCalendarStore } from '@/lib/store'
import { TemporalGranularity, TEMPORAL_GRANULARITY_LABELS } from '@/lib/types'
import { clsx } from 'clsx'

interface ViewPreset {
  granularity: TemporalGranularity
  label: string
  shortLabel: string
  icon: React.ReactNode
}

const VIEW_PRESETS: ViewPreset[] = [
  {
    granularity: TemporalGranularity.DAY,
    label: 'Day view',
    shortLabel: 'Day',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 2v4M16 2v4" />
        <rect x="7" y="14" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.3" />
      </svg>
    ),
  },
  {
    granularity: TemporalGranularity.WEEK,
    label: 'Week view',
    shortLabel: 'Week',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 2v4M16 2v4" />
        <path d="M7 14h10" strokeOpacity="0.5" />
        <path d="M7 17h10" strokeOpacity="0.5" />
      </svg>
    ),
  },
  {
    granularity: TemporalGranularity.MONTH,
    label: 'Month view',
    shortLabel: 'Month',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 2v4M16 2v4" />
        <path d="M7 14h2M11 14h2M15 14h2" strokeWidth="1.5" />
        <path d="M7 17h2M11 17h2M15 17h2" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    granularity: TemporalGranularity.SEASON,
    label: 'Season view (quarter)',
    shortLabel: 'Season',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="6" height="18" rx="1" />
        <rect x="9" y="4" width="6" height="18" rx="1" />
        <rect x="16" y="4" width="6" height="18" rx="1" />
        <path d="M2 9h6M9 9h6M16 9h6" strokeWidth="1" />
      </svg>
    ),
  },
  {
    granularity: TemporalGranularity.YEAR,
    label: 'Year view',
    shortLabel: 'Year',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="9" height="9" rx="1" />
        <rect x="13" y="2" width="9" height="9" rx="1" />
        <rect x="2" y="13" width="9" height="9" rx="1" />
        <rect x="13" y="13" width="9" height="9" rx="1" />
      </svg>
    ),
  },
  {
    granularity: TemporalGranularity.DECADE,
    label: 'Decade view',
    shortLabel: 'Decade',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="1" width="5" height="5" rx="0.5" />
        <rect x="7" y="1" width="5" height="5" rx="0.5" />
        <rect x="13" y="1" width="5" height="5" rx="0.5" />
        <rect x="19" y="1" width="4" height="5" rx="0.5" />
        <rect x="1" y="7.5" width="5" height="5" rx="0.5" />
        <rect x="7" y="7.5" width="5" height="5" rx="0.5" />
        <rect x="13" y="7.5" width="5" height="5" rx="0.5" />
        <rect x="19" y="7.5" width="4" height="5" rx="0.5" />
        <rect x="1" y="14" width="5" height="5" rx="0.5" />
        <rect x="7" y="14" width="5" height="5" rx="0.5" />
        <rect x="13" y="14" width="5" height="5" rx="0.5" />
        <rect x="19" y="14" width="4" height="5" rx="0.5" />
      </svg>
    ),
  },
]

interface ViewSwitcherProps {
  compact?: boolean
}

export function ViewSwitcher({ compact = false }: ViewSwitcherProps) {
  const { temporalGranularity, setTemporalGranularity } = useCalendarStore()

  return (
    <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
      {VIEW_PRESETS.map((preset) => {
        const isActive = temporalGranularity === preset.granularity
        return (
          <button
            key={preset.granularity}
            onClick={() => setTemporalGranularity(preset.granularity)}
            className={clsx(
              'flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-150',
              isActive
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600/50'
            )}
            title={`${preset.label} (${TEMPORAL_GRANULARITY_LABELS[preset.granularity]})`}
          >
            {preset.icon}
            {!compact && <span className="hidden sm:inline">{preset.shortLabel}</span>}
          </button>
        )
      })}
    </div>
  )
}
