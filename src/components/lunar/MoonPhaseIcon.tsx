'use client'

import type { LunarPhaseInfo } from '@/lib/types'
import { clsx } from 'clsx'

interface MoonPhaseIconProps {
  phase: LunarPhaseInfo
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const SIZE_CLASSES = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
}

export function MoonPhaseIcon({ phase, size = 'sm', showLabel = false }: MoonPhaseIconProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-0.5',
        SIZE_CLASSES[size]
      )}
      title={`${phase.phase.replace(/_/g, ' ')} (${(phase.illumination * 100).toFixed(0)}%)`}
    >
      <span>{phase.emoji}</span>
      {showLabel && (
        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
          {phase.phase.replace(/_/g, ' ')}
        </span>
      )}
    </span>
  )
}
