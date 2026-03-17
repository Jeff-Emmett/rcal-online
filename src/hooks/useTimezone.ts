'use client'

import { useEffect } from 'react'
import { useCalendarStore } from '@/lib/store'

/**
 * Detects the browser's timezone and syncs it to the store.
 * No API calls — rcal-online is view-only.
 */
export function useTimezone() {
  const viewerTimezone = useCalendarStore((s) => s.viewerTimezone)
  const setViewerTimezone = useCalendarStore((s) => s.setViewerTimezone)

  useEffect(() => {
    const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (browserTz && browserTz !== viewerTimezone) {
      setViewerTimezone(browserTz)
    }
  }, [viewerTimezone, setViewerTimezone])

  return viewerTimezone
}
