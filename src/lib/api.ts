import type { EventListItem, CalendarSource, UnifiedEvent, LunarPhaseInfo } from './types'

const API_URL = '/api'

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// ── Response Types ──

export interface EventsResponse {
  count: number
  next: string | null
  previous: string | null
  results: EventListItem[]
}

export interface SourcesResponse {
  count: number
  next: string | null
  previous: string | null
  results: CalendarSource[]
}

// ── Events API ──

export async function getEvents(params?: {
  start?: string
  end?: string
  source?: string
  location?: string
  search?: string
  rTool?: string
  rEntityId?: string
}): Promise<EventsResponse> {
  const searchParams = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value))
      }
    })
  }

  const query = searchParams.toString()
  return fetcher(`/events${query ? `?${query}` : ''}`)
}

export async function getEvent(id: string): Promise<UnifiedEvent> {
  return fetcher(`/events/${id}`)
}

export async function getUpcomingEvents(days = 7): Promise<EventsResponse> {
  return fetcher(`/events?upcoming=${days}`)
}

export async function getTodayEvents(): Promise<EventsResponse> {
  const today = new Date().toISOString().split('T')[0]
  return fetcher(`/events?start=${today}&end=${today}`)
}

// ── Sources API ──

export async function getSources(params?: {
  is_active?: boolean
  is_visible?: boolean
  source_type?: string
}): Promise<SourcesResponse> {
  const searchParams = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value))
      }
    })
  }

  const query = searchParams.toString()
  return fetcher(`/sources${query ? `?${query}` : ''}`)
}

export async function syncSource(id: string) {
  return fetcher(`/sources/${id}/sync`, { method: 'POST' })
}

export async function syncAllSources() {
  const response = await getSources({ is_active: true })
  const syncPromises = response.results.map((source) => syncSource(source.id))
  return Promise.allSettled(syncPromises)
}

// ── Locations API ──

export async function getLocations(params?: {
  granularity?: number
  parent?: string
  search?: string
}) {
  const searchParams = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value))
      }
    })
  }

  const query = searchParams.toString()
  return fetcher(`/locations${query ? `?${query}` : ''}`)
}

export async function getLocationRoots() {
  return fetcher(`/locations?root=true`)
}

export async function getLocationTree() {
  return fetcher(`/locations/tree`)
}

// ── Lunar API ──

export async function getLunarData(params: {
  start: string
  end: string
  lat?: number
  lng?: number
}): Promise<Map<string, LunarPhaseInfo>> {
  const searchParams = new URLSearchParams({
    start: params.start,
    end: params.end,
  })
  if (params.lat !== undefined) searchParams.append('lat', String(params.lat))
  if (params.lng !== undefined) searchParams.append('lng', String(params.lng))

  return fetcher(`/lunar?${searchParams}`)
}

// ── Context API (r* tool bridge) ──

export async function getContextEvents(
  tool: string,
  entityId: string
) {
  return fetcher(`/context/${tool}?entityId=${entityId}`)
}

// ── Stats API ──

export async function getCalendarStats() {
  return fetcher(`/stats`)
}
