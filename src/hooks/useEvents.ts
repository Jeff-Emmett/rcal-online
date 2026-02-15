'use client'

import { useQuery } from '@tanstack/react-query'
import { getEvents, getSources } from '../lib/api'
import type { EventsResponse, SourcesResponse } from '../lib/api'

export type { EventsResponse, SourcesResponse }

export function useEvents(params?: {
  start?: string
  end?: string
  source?: string
}) {
  return useQuery<EventsResponse>({
    queryKey: ['events', params],
    queryFn: () => getEvents(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useMonthEvents(year: number, month: number) {
  const start = new Date(year, month - 1, 1).toISOString().split('T')[0]
  const end = new Date(year, month, 0).toISOString().split('T')[0]

  return useQuery<EventsResponse>({
    queryKey: ['events', 'month', year, month],
    queryFn: () => getEvents({ start, end }),
    staleTime: 5 * 60 * 1000,
  })
}

export function useSources() {
  return useQuery<SourcesResponse>({
    queryKey: ['sources'],
    queryFn: () => getSources(),
    staleTime: 10 * 60 * 1000,
  })
}

export function groupEventsByDate<T extends { start: string }>(events: T[]): Map<string, T[]> {
  const grouped = new Map<string, T[]>()

  for (const event of events) {
    const dateKey = event.start.split('T')[0]
    const existing = grouped.get(dateKey) || []
    existing.push(event)
    grouped.set(dateKey, existing)
  }

  return grouped
}
