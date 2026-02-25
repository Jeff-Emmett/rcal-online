'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { generateDemoEvents, getDemoEventsForRange, DEMO_SOURCES } from '@/lib/demo-data'
import type { EventsResponse, SourcesResponse } from '@/lib/api'

/**
 * Pre-populates the React Query cache with demo data.
 * Place this inside the demo page (must be within QueryClientProvider).
 * Seeds events for current month +/- 3 months so all views have data.
 */
export function DemoDataSeeder() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const now = new Date()
    const allEvents = generateDemoEvents()

    // Seed month-level queries for -2 to +3 months
    for (let offset = -2; offset <= 3; offset++) {
      const d = new Date(now.getFullYear(), now.getMonth() + offset, 1)
      const year = d.getFullYear()
      const month = d.getMonth() + 1
      const start = new Date(year, month - 1, 1).toISOString().split('T')[0]
      const end = new Date(year, month, 0).toISOString().split('T')[0]

      const monthEvents = getDemoEventsForRange(start, end)

      const response: EventsResponse = {
        count: monthEvents.length,
        next: null,
        previous: null,
        results: monthEvents,
      }

      // Match the queryKey used by useMonthEvents
      queryClient.setQueryData(['events', 'month', year, month], response)
    }

    // Seed the generic events query (used by SpatialTab's useEvents)
    // Seed for common date range patterns
    const seedGenericRange = (start: string, end: string) => {
      const rangeEvents = getDemoEventsForRange(start, end)
      const response: EventsResponse = {
        count: rangeEvents.length,
        next: null,
        previous: null,
        results: rangeEvents,
      }
      queryClient.setQueryData(['events', { start, end }], response)
    }

    // Current month range
    const curStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    const curEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
    seedGenericRange(curStart, curEnd)

    // Current week
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)
    seedGenericRange(weekStart.toISOString().split('T')[0], weekEnd.toISOString().split('T')[0])

    // Today
    const today = now.toISOString().split('T')[0]
    seedGenericRange(today, today)

    // Current quarter
    const qMonth = Math.floor(now.getMonth() / 3) * 3
    const qStart = new Date(now.getFullYear(), qMonth, 1).toISOString().split('T')[0]
    const qEnd = new Date(now.getFullYear(), qMonth + 3, 0).toISOString().split('T')[0]
    seedGenericRange(qStart, qEnd)

    // Current year
    const yearStart = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]
    const yearEnd = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0]
    seedGenericRange(yearStart, yearEnd)

    // Seed sources
    const sourcesResponse: SourcesResponse = {
      count: DEMO_SOURCES.length,
      next: null,
      previous: null,
      results: DEMO_SOURCES.map((s) => ({
        ...s,
        event_count: allEvents.filter((e) => e.source === s.id).length,
      })),
    }
    queryClient.setQueryData(['sources'], sourcesResponse)
  }, [queryClient])

  return null
}
