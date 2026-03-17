'use client'

import { useTimezone } from '@/hooks/useTimezone'

/** Invisible component that syncs browser timezone to store on mount. */
export function TimezoneSync() {
  useTimezone()
  return null
}
