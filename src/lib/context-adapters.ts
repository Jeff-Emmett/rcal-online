import type { RToolName, RCalContext, RCalEvent } from './types'

/**
 * View adapter interface for r* tool integration.
 * Each r* tool registers an adapter that knows how to fetch and render
 * context-specific calendar data.
 */
export interface RCalViewAdapter {
  toolName: RToolName
  label: string
  description: string
  fetchEvents(context: RCalContext): Promise<RCalEvent[]>
}

// ── Adapter Registry ──

const adapters = new Map<RToolName, RCalViewAdapter>()

export function registerAdapter(adapter: RCalViewAdapter): void {
  adapters.set(adapter.toolName, adapter)
}

export function getAdapter(tool: RToolName): RCalViewAdapter | undefined {
  return adapters.get(tool)
}

export function getAllAdapters(): RCalViewAdapter[] {
  return Array.from(adapters.values())
}

// ── Built-in Adapters ──

registerAdapter({
  toolName: 'rTrips',
  label: 'Trip Timeline',
  description: 'Departure → waypoints → return timeline',
  async fetchEvents(context) {
    // TODO: Connect to rTrips API when available
    // For now, return mock data showing the adapter pattern works
    if (!context.entityId) return []
    return [
      {
        id: `trip-${context.entityId}-depart`,
        source: 'rTrips',
        source_name: 'rTrips',
        source_color: '#10b981',
        source_type: 'manual',
        external_id: '',
        title: `Trip departure`,
        description: `Departure for trip ${context.entityId}`,
        start: context.dateRange?.start.toISOString() || new Date().toISOString(),
        end: context.dateRange?.start.toISOString() || new Date().toISOString(),
        all_day: true,
        timezone_str: 'UTC',
        rrule: '',
        is_recurring: false,
        location: null,
        location_raw: '',
        location_display: null,
        location_breadcrumb: null,
        latitude: null,
        longitude: null,
        coordinates: null,
        location_granularity: null,
        is_virtual: false,
        virtual_url: '',
        virtual_platform: '',
        organizer_name: '',
        organizer_email: '',
        attendees: [],
        attendee_count: 0,
        status: 'confirmed',
        visibility: 'default',
        duration_minutes: 0,
        is_upcoming: true,
        is_ongoing: false,
        rToolSource: 'rTrips',
        rToolEntityId: context.entityId,
        eventCategory: 'travel',
      },
    ]
  },
})

registerAdapter({
  toolName: 'rNetwork',
  label: 'Network Timeline',
  description: 'Relationship events and interaction history',
  async fetchEvents() {
    // Stub: will connect to rNetwork API
    return []
  },
})

registerAdapter({
  toolName: 'rMaps',
  label: 'Location Events',
  description: 'Place-centric event timeline',
  async fetchEvents() {
    // Stub: will connect to rMaps API
    return []
  },
})

registerAdapter({
  toolName: 'rCart',
  label: 'Transaction Timeline',
  description: 'Financial events and transaction history',
  async fetchEvents() {
    // Stub: will connect to rCart API
    return []
  },
})

registerAdapter({
  toolName: 'rNotes',
  label: 'Notes Timeline',
  description: 'Notes and journal entries on a timeline',
  async fetchEvents() {
    // Stub: will connect to rNotes API
    return []
  },
})
