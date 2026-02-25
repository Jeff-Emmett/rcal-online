import type { EventListItem, CalendarSource } from './types'

// ── Demo Calendar Sources ──

export const DEMO_SOURCES: CalendarSource[] = [
  {
    id: 'work',
    name: 'Work',
    source_type: 'google',
    source_type_display: 'Google Calendar',
    color: '#3b82f6',
    is_visible: true,
    is_active: true,
    last_synced_at: new Date().toISOString(),
    sync_error: '',
    event_count: 0,
  },
  {
    id: 'travel',
    name: 'Travel',
    source_type: 'manual',
    source_type_display: 'Manual',
    color: '#f97316',
    is_visible: true,
    is_active: true,
    last_synced_at: new Date().toISOString(),
    sync_error: '',
    event_count: 0,
  },
  {
    id: 'personal',
    name: 'Personal',
    source_type: 'ics',
    source_type_display: 'ICS',
    color: '#10b981',
    is_visible: true,
    is_active: true,
    last_synced_at: new Date().toISOString(),
    sync_error: '',
    event_count: 0,
  },
  {
    id: 'conferences',
    name: 'Conferences',
    source_type: 'manual',
    source_type_display: 'Manual',
    color: '#8b5cf6',
    is_visible: true,
    is_active: true,
    last_synced_at: new Date().toISOString(),
    sync_error: '',
    event_count: 0,
  },
]

// ── Helpers ──

function makeId(): string {
  return `demo-${Math.random().toString(36).slice(2, 10)}`
}

function isoDate(year: number, month: number, day: number, hour = 0, minute = 0): string {
  return new Date(year, month - 1, day, hour, minute).toISOString()
}

// ── Generate demo events relative to current date ──

export function generateDemoEvents(): EventListItem[] {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth() + 1 // 1-indexed

  // Helper for months relative to current
  const rel = (monthOffset: number, day: number, hour = 0, minute = 0) => {
    const date = new Date(y, now.getMonth() + monthOffset, day, hour, minute)
    return date.toISOString()
  }

  const events: EventListItem[] = [
    // ─── THIS MONTH: Dense schedule ───

    // Work meetings in Berlin
    {
      id: makeId(), title: 'Team Standup', source: 'work', source_color: '#3b82f6',
      start: rel(0, 3, 9, 0), end: rel(0, 3, 9, 30), all_day: false,
      location_raw: 'Berlin, Germany', location_breadcrumb: 'Earth > Europe > Germany > Berlin',
      is_virtual: false, status: 'confirmed',
      latitude: 52.5200, longitude: 13.4050,
    },
    {
      id: makeId(), title: 'Product Review', source: 'work', source_color: '#3b82f6',
      start: rel(0, 5, 14, 0), end: rel(0, 5, 15, 30), all_day: false,
      location_raw: 'Berlin, Germany', location_breadcrumb: 'Earth > Europe > Germany > Berlin',
      is_virtual: false, status: 'confirmed',
      latitude: 52.5200, longitude: 13.4050,
    },
    {
      id: makeId(), title: 'Sprint Planning', source: 'work', source_color: '#3b82f6',
      start: rel(0, 7, 10, 0), end: rel(0, 7, 12, 0), all_day: false,
      location_raw: 'Berlin, Germany', location_breadcrumb: 'Earth > Europe > Germany > Berlin',
      is_virtual: false, status: 'confirmed',
      latitude: 52.5200, longitude: 13.4050,
    },
    {
      id: makeId(), title: 'Client Call - NYC', source: 'work', source_color: '#3b82f6',
      start: rel(0, 8, 16, 0), end: rel(0, 8, 17, 0), all_day: false,
      location_raw: 'Virtual (Zoom)', location_breadcrumb: null,
      is_virtual: true, status: 'confirmed',
      latitude: null, longitude: null,
    },
    {
      id: makeId(), title: '1:1 with Manager', source: 'work', source_color: '#3b82f6',
      start: rel(0, 10, 11, 0), end: rel(0, 10, 11, 30), all_day: false,
      location_raw: 'Berlin, Germany', location_breadcrumb: 'Earth > Europe > Germany > Berlin',
      is_virtual: false, status: 'confirmed',
      latitude: 52.5200, longitude: 13.4050,
    },

    // Travel: Berlin → Amsterdam
    {
      id: makeId(), title: 'Train to Amsterdam', source: 'travel', source_color: '#f97316',
      start: rel(0, 12, 7, 30), end: rel(0, 12, 13, 45), all_day: false,
      location_raw: 'Berlin Hbf → Amsterdam Centraal',
      location_breadcrumb: 'Earth > Europe > Germany > Berlin',
      is_virtual: false, status: 'confirmed',
      latitude: 52.5251, longitude: 13.3694, // Berlin Hbf
    },
    {
      id: makeId(), title: 'Arrive Amsterdam', source: 'travel', source_color: '#f97316',
      start: rel(0, 12, 13, 45), end: rel(0, 12, 14, 30), all_day: false,
      location_raw: 'Amsterdam Centraal', location_breadcrumb: 'Earth > Europe > Netherlands > Amsterdam',
      is_virtual: false, status: 'confirmed',
      latitude: 52.3791, longitude: 4.9003,
    },

    // Amsterdam meetings
    {
      id: makeId(), title: 'Partner Meeting', source: 'work', source_color: '#3b82f6',
      start: rel(0, 13, 10, 0), end: rel(0, 13, 12, 0), all_day: false,
      location_raw: 'Amsterdam, Netherlands',
      location_breadcrumb: 'Earth > Europe > Netherlands > Amsterdam',
      is_virtual: false, status: 'confirmed',
      latitude: 52.3676, longitude: 4.9041,
    },
    {
      id: makeId(), title: 'Canal District Walk', source: 'personal', source_color: '#10b981',
      start: rel(0, 13, 15, 0), end: rel(0, 13, 17, 0), all_day: false,
      location_raw: 'Jordaan, Amsterdam',
      location_breadcrumb: 'Earth > Europe > Netherlands > Amsterdam',
      is_virtual: false, status: 'confirmed',
      latitude: 52.3738, longitude: 4.8820,
    },

    // Return to Berlin
    {
      id: makeId(), title: 'Train to Berlin', source: 'travel', source_color: '#f97316',
      start: rel(0, 14, 8, 0), end: rel(0, 14, 14, 15), all_day: false,
      location_raw: 'Amsterdam Centraal → Berlin Hbf',
      location_breadcrumb: 'Earth > Europe > Netherlands > Amsterdam',
      is_virtual: false, status: 'confirmed',
      latitude: 52.3791, longitude: 4.9003,
    },

    // Personal events
    {
      id: makeId(), title: 'Dinner with Friends', source: 'personal', source_color: '#10b981',
      start: rel(0, 15, 19, 0), end: rel(0, 15, 22, 0), all_day: false,
      location_raw: 'Kreuzberg, Berlin',
      location_breadcrumb: 'Earth > Europe > Germany > Berlin',
      is_virtual: false, status: 'confirmed',
      latitude: 52.4934, longitude: 13.4032,
    },
    {
      id: makeId(), title: 'Weekend Hike', source: 'personal', source_color: '#10b981',
      start: rel(0, 17, 8, 0), end: rel(0, 17, 16, 0), all_day: false,
      location_raw: 'Grunewald, Berlin',
      location_breadcrumb: 'Earth > Europe > Germany > Berlin',
      is_virtual: false, status: 'confirmed',
      latitude: 52.4730, longitude: 13.2260,
    },
    {
      id: makeId(), title: 'Yoga Class', source: 'personal', source_color: '#10b981',
      start: rel(0, 20, 7, 0), end: rel(0, 20, 8, 0), all_day: false,
      location_raw: 'Prenzlauer Berg, Berlin',
      location_breadcrumb: 'Earth > Europe > Germany > Berlin',
      is_virtual: false, status: 'confirmed',
      latitude: 52.5388, longitude: 13.4244,
    },

    // Work wrap-up
    {
      id: makeId(), title: 'Sprint Retro', source: 'work', source_color: '#3b82f6',
      start: rel(0, 21, 14, 0), end: rel(0, 21, 15, 0), all_day: false,
      location_raw: 'Berlin, Germany', location_breadcrumb: 'Earth > Europe > Germany > Berlin',
      is_virtual: false, status: 'confirmed',
      latitude: 52.5200, longitude: 13.4050,
    },
    {
      id: makeId(), title: 'Demo Day', source: 'work', source_color: '#3b82f6',
      start: rel(0, 22, 15, 0), end: rel(0, 22, 16, 30), all_day: false,
      location_raw: 'Berlin, Germany', location_breadcrumb: 'Earth > Europe > Germany > Berlin',
      is_virtual: false, status: 'confirmed',
      latitude: 52.5200, longitude: 13.4050,
    },

    // Conference at end of month
    {
      id: makeId(), title: 'Web Summit (Day 1)', source: 'conferences', source_color: '#8b5cf6',
      start: rel(0, 25, 9, 0), end: rel(0, 25, 18, 0), all_day: false,
      location_raw: 'Lisbon, Portugal',
      location_breadcrumb: 'Earth > Europe > Portugal > Lisbon',
      is_virtual: false, status: 'confirmed',
      latitude: 38.7223, longitude: -9.1393,
    },
    {
      id: makeId(), title: 'Web Summit (Day 2)', source: 'conferences', source_color: '#8b5cf6',
      start: rel(0, 26, 9, 0), end: rel(0, 26, 18, 0), all_day: false,
      location_raw: 'Lisbon, Portugal',
      location_breadcrumb: 'Earth > Europe > Portugal > Lisbon',
      is_virtual: false, status: 'confirmed',
      latitude: 38.7223, longitude: -9.1393,
    },
    {
      id: makeId(), title: 'Lisbon City Tour', source: 'personal', source_color: '#10b981',
      start: rel(0, 27, 10, 0), end: rel(0, 27, 17, 0), all_day: false,
      location_raw: 'Alfama, Lisbon',
      location_breadcrumb: 'Earth > Europe > Portugal > Lisbon',
      is_virtual: false, status: 'confirmed',
      latitude: 38.7139, longitude: -9.1300,
    },

    // ─── LAST MONTH ───

    {
      id: makeId(), title: 'Quarterly Planning', source: 'work', source_color: '#3b82f6',
      start: rel(-1, 5, 9, 0), end: rel(-1, 5, 17, 0), all_day: false,
      location_raw: 'Berlin, Germany', location_breadcrumb: 'Earth > Europe > Germany > Berlin',
      is_virtual: false, status: 'confirmed',
      latitude: 52.5200, longitude: 13.4050,
    },
    {
      id: makeId(), title: 'Munich Trip', source: 'travel', source_color: '#f97316',
      start: rel(-1, 10, 6, 0), end: rel(-1, 10, 10, 30), all_day: false,
      location_raw: 'Berlin → Munich (Flight)',
      location_breadcrumb: 'Earth > Europe > Germany > Berlin',
      is_virtual: false, status: 'confirmed',
      latitude: 52.5200, longitude: 13.4050,
    },
    {
      id: makeId(), title: 'Munich Office Visit', source: 'work', source_color: '#3b82f6',
      start: rel(-1, 10, 13, 0), end: rel(-1, 10, 17, 0), all_day: false,
      location_raw: 'Munich, Germany',
      location_breadcrumb: 'Earth > Europe > Germany > Munich',
      is_virtual: false, status: 'confirmed',
      latitude: 48.1351, longitude: 11.5820,
    },
    {
      id: makeId(), title: 'Olympiapark Jog', source: 'personal', source_color: '#10b981',
      start: rel(-1, 11, 7, 0), end: rel(-1, 11, 8, 30), all_day: false,
      location_raw: 'Olympiapark, Munich',
      location_breadcrumb: 'Earth > Europe > Germany > Munich',
      is_virtual: false, status: 'confirmed',
      latitude: 48.1749, longitude: 11.5526,
    },
    {
      id: makeId(), title: 'Return to Berlin', source: 'travel', source_color: '#f97316',
      start: rel(-1, 12, 15, 0), end: rel(-1, 12, 16, 30), all_day: false,
      location_raw: 'Munich → Berlin (Flight)',
      location_breadcrumb: 'Earth > Europe > Germany > Munich',
      is_virtual: false, status: 'confirmed',
      latitude: 48.1351, longitude: 11.5820,
    },
    {
      id: makeId(), title: 'Birthday Party', source: 'personal', source_color: '#10b981',
      start: rel(-1, 18, 18, 0), end: rel(-1, 18, 23, 0), all_day: false,
      location_raw: 'Friedrichshain, Berlin',
      location_breadcrumb: 'Earth > Europe > Germany > Berlin',
      is_virtual: false, status: 'confirmed',
      latitude: 52.5125, longitude: 13.4556,
    },
    {
      id: makeId(), title: 'Hackathon', source: 'work', source_color: '#3b82f6',
      start: rel(-1, 22, 0, 0), end: rel(-1, 23, 23, 59), all_day: true,
      location_raw: 'c-base, Berlin',
      location_breadcrumb: 'Earth > Europe > Germany > Berlin',
      is_virtual: false, status: 'confirmed',
      latitude: 52.5130, longitude: 13.4200,
    },

    // ─── NEXT MONTH ───

    // Trip to Paris
    {
      id: makeId(), title: 'Flight to Paris', source: 'travel', source_color: '#f97316',
      start: rel(1, 3, 8, 0), end: rel(1, 3, 10, 30), all_day: false,
      location_raw: 'BER → CDG',
      location_breadcrumb: 'Earth > Europe > Germany > Berlin',
      is_virtual: false, status: 'confirmed',
      latitude: 52.3667, longitude: 13.5033, // BER airport
    },
    {
      id: makeId(), title: 'Paris Office Kickoff', source: 'work', source_color: '#3b82f6',
      start: rel(1, 4, 9, 0), end: rel(1, 4, 17, 0), all_day: false,
      location_raw: 'Le Marais, Paris',
      location_breadcrumb: 'Earth > Europe > France > Paris',
      is_virtual: false, status: 'confirmed',
      latitude: 48.8566, longitude: 2.3522,
    },
    {
      id: makeId(), title: 'Louvre Visit', source: 'personal', source_color: '#10b981',
      start: rel(1, 5, 10, 0), end: rel(1, 5, 14, 0), all_day: false,
      location_raw: 'Louvre Museum, Paris',
      location_breadcrumb: 'Earth > Europe > France > Paris',
      is_virtual: false, status: 'confirmed',
      latitude: 48.8606, longitude: 2.3376,
    },
    {
      id: makeId(), title: 'Return to Berlin', source: 'travel', source_color: '#f97316',
      start: rel(1, 6, 18, 0), end: rel(1, 6, 20, 30), all_day: false,
      location_raw: 'CDG → BER',
      location_breadcrumb: 'Earth > Europe > France > Paris',
      is_virtual: false, status: 'confirmed',
      latitude: 49.0097, longitude: 2.5479, // CDG airport
    },

    // Mid-month work
    {
      id: makeId(), title: 'Board Meeting', source: 'work', source_color: '#3b82f6',
      start: rel(1, 12, 10, 0), end: rel(1, 12, 12, 0), all_day: false,
      location_raw: 'Berlin, Germany', location_breadcrumb: 'Earth > Europe > Germany > Berlin',
      is_virtual: false, status: 'confirmed',
      latitude: 52.5200, longitude: 13.4050,
    },
    {
      id: makeId(), title: 'Design Workshop', source: 'work', source_color: '#3b82f6',
      start: rel(1, 15, 13, 0), end: rel(1, 15, 17, 0), all_day: false,
      location_raw: 'Berlin, Germany', location_breadcrumb: 'Earth > Europe > Germany > Berlin',
      is_virtual: false, status: 'confirmed',
      latitude: 52.5200, longitude: 13.4050,
    },

    // Weekend trip to Prague
    {
      id: makeId(), title: 'Bus to Prague', source: 'travel', source_color: '#f97316',
      start: rel(1, 20, 7, 0), end: rel(1, 20, 11, 30), all_day: false,
      location_raw: 'Berlin ZOB → Prague',
      location_breadcrumb: 'Earth > Europe > Germany > Berlin',
      is_virtual: false, status: 'confirmed',
      latitude: 52.5074, longitude: 13.2790, // Berlin ZOB
    },
    {
      id: makeId(), title: 'Prague Castle Visit', source: 'personal', source_color: '#10b981',
      start: rel(1, 21, 10, 0), end: rel(1, 21, 15, 0), all_day: false,
      location_raw: 'Prague Castle, Prague',
      location_breadcrumb: 'Earth > Europe > Czech Republic > Prague',
      is_virtual: false, status: 'confirmed',
      latitude: 50.0911, longitude: 14.4003,
    },
    {
      id: makeId(), title: 'Bus to Berlin', source: 'travel', source_color: '#f97316',
      start: rel(1, 22, 14, 0), end: rel(1, 22, 18, 30), all_day: false,
      location_raw: 'Prague → Berlin ZOB',
      location_breadcrumb: 'Earth > Europe > Czech Republic > Prague',
      is_virtual: false, status: 'confirmed',
      latitude: 50.0755, longitude: 14.4378,
    },

    // ─── TWO MONTHS OUT ───

    {
      id: makeId(), title: 'Annual Retreat', source: 'work', source_color: '#3b82f6',
      start: rel(2, 8, 0, 0), end: rel(2, 11, 23, 59), all_day: true,
      location_raw: 'Barcelona, Spain',
      location_breadcrumb: 'Earth > Europe > Spain > Barcelona',
      is_virtual: false, status: 'tentative',
      latitude: 41.3874, longitude: 2.1686,
    },
    {
      id: makeId(), title: 'Sagrada Familia Tour', source: 'personal', source_color: '#10b981',
      start: rel(2, 9, 10, 0), end: rel(2, 9, 13, 0), all_day: false,
      location_raw: 'Sagrada Familia, Barcelona',
      location_breadcrumb: 'Earth > Europe > Spain > Barcelona',
      is_virtual: false, status: 'confirmed',
      latitude: 41.4036, longitude: 2.1744,
    },
    {
      id: makeId(), title: 'EthCC Conference', source: 'conferences', source_color: '#8b5cf6',
      start: rel(2, 18, 9, 0), end: rel(2, 20, 18, 0), all_day: true,
      location_raw: 'Brussels, Belgium',
      location_breadcrumb: 'Earth > Europe > Belgium > Brussels',
      is_virtual: false, status: 'confirmed',
      latitude: 50.8503, longitude: 4.3517,
    },
  ]

  // Assign coordinates object for events that have lat/lng
  return events.map((e) => ({
    ...e,
    coordinates:
      e.latitude != null && e.longitude != null
        ? { latitude: e.latitude, longitude: e.longitude }
        : null,
  }))
}

/**
 * Get demo events filtered to a date range.
 */
export function getDemoEventsForRange(start: string, end: string): EventListItem[] {
  const allEvents = generateDemoEvents()
  const startDate = new Date(start)
  const endDate = new Date(end)
  endDate.setHours(23, 59, 59, 999)

  return allEvents.filter((e) => {
    const eventStart = new Date(e.start)
    const eventEnd = new Date(e.end)
    return eventStart <= endDate && eventEnd >= startDate
  })
}
