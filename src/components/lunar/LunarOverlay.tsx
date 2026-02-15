'use client'

import { useMemo } from 'react'
import { getLunarDataForRange } from '@/lib/lunar'
import type { LunarPhaseInfo } from '@/lib/types'

/**
 * Hook to compute lunar data for a given month.
 * Returns a Map<string, LunarPhaseInfo> keyed by "YYYY-MM-DD".
 */
export function useLunarMonth(year: number, month: number): Map<string, LunarPhaseInfo> {
  return useMemo(() => {
    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 0) // Last day of month
    return getLunarDataForRange(start, end)
  }, [year, month])
}
