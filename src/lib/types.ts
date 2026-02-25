// ── Calendar Types ──

export type CalendarType = 'gregorian' | 'lunar'

export type ViewType = 'month' | 'week' | 'day' | 'year' | 'timeline'

export type TabView = 'temporal' | 'spatial' | 'lunar' | 'context'

// ── Temporal Granularity ── zoom levels for time navigation

export enum TemporalGranularity {
  MOMENT = 0,
  HOUR = 1,
  DAY = 2,
  WEEK = 3,
  MONTH = 4,
  SEASON = 5,
  YEAR = 6,
  DECADE = 7,
  CENTURY = 8,
  COSMIC = 9,
}

export const TEMPORAL_GRANULARITY_LABELS: Record<TemporalGranularity, string> = {
  [TemporalGranularity.MOMENT]: 'Moment',
  [TemporalGranularity.HOUR]: 'Hour',
  [TemporalGranularity.DAY]: 'Day',
  [TemporalGranularity.WEEK]: 'Week',
  [TemporalGranularity.MONTH]: 'Month',
  [TemporalGranularity.SEASON]: 'Season',
  [TemporalGranularity.YEAR]: 'Year',
  [TemporalGranularity.DECADE]: 'Decade',
  [TemporalGranularity.CENTURY]: 'Century',
  [TemporalGranularity.COSMIC]: 'Cosmic',
}

export const TEMPORAL_TO_VIEW: Partial<Record<TemporalGranularity, ViewType>> = {
  [TemporalGranularity.DAY]: 'day',
  [TemporalGranularity.WEEK]: 'week',
  [TemporalGranularity.MONTH]: 'month',
  [TemporalGranularity.YEAR]: 'year',
  [TemporalGranularity.DECADE]: 'timeline',
}

// ── Spatial Granularity ──

export enum SpatialGranularity {
  PLANET = 0,
  CONTINENT = 1,
  BIOREGION = 2,
  COUNTRY = 3,
  REGION = 4,
  CITY = 5,
  NEIGHBORHOOD = 6,
  ADDRESS = 7,
  COORDINATES = 8,
}

export const GRANULARITY_LABELS: Record<SpatialGranularity, string> = {
  [SpatialGranularity.PLANET]: 'Planet',
  [SpatialGranularity.CONTINENT]: 'Continent',
  [SpatialGranularity.BIOREGION]: 'Bioregion',
  [SpatialGranularity.COUNTRY]: 'Country',
  [SpatialGranularity.REGION]: 'Region',
  [SpatialGranularity.CITY]: 'City',
  [SpatialGranularity.NEIGHBORHOOD]: 'Neighborhood',
  [SpatialGranularity.ADDRESS]: 'Address',
  [SpatialGranularity.COORDINATES]: 'Coordinates',
}

// ── Temporal ↔ Spatial Coupling ──

export const TEMPORAL_TO_SPATIAL: Record<TemporalGranularity, SpatialGranularity> = {
  [TemporalGranularity.MOMENT]: SpatialGranularity.COORDINATES,
  [TemporalGranularity.HOUR]: SpatialGranularity.ADDRESS,
  [TemporalGranularity.DAY]: SpatialGranularity.ADDRESS,
  [TemporalGranularity.WEEK]: SpatialGranularity.CITY,
  [TemporalGranularity.MONTH]: SpatialGranularity.COUNTRY,
  [TemporalGranularity.SEASON]: SpatialGranularity.COUNTRY,
  [TemporalGranularity.YEAR]: SpatialGranularity.CONTINENT,
  [TemporalGranularity.DECADE]: SpatialGranularity.CONTINENT,
  [TemporalGranularity.CENTURY]: SpatialGranularity.PLANET,
  [TemporalGranularity.COSMIC]: SpatialGranularity.PLANET,
}

export const SPATIAL_TO_LEAFLET_ZOOM: Record<SpatialGranularity, number> = {
  [SpatialGranularity.PLANET]: 2,
  [SpatialGranularity.CONTINENT]: 4,
  [SpatialGranularity.BIOREGION]: 5,
  [SpatialGranularity.COUNTRY]: 6,
  [SpatialGranularity.REGION]: 8,
  [SpatialGranularity.CITY]: 11,
  [SpatialGranularity.NEIGHBORHOOD]: 14,
  [SpatialGranularity.ADDRESS]: 16,
  [SpatialGranularity.COORDINATES]: 18,
}

export function leafletZoomToSpatial(zoom: number): SpatialGranularity {
  if (zoom <= 2) return SpatialGranularity.PLANET
  if (zoom <= 4) return SpatialGranularity.CONTINENT
  if (zoom <= 5) return SpatialGranularity.BIOREGION
  if (zoom <= 7) return SpatialGranularity.COUNTRY
  if (zoom <= 9) return SpatialGranularity.REGION
  if (zoom <= 12) return SpatialGranularity.CITY
  if (zoom <= 15) return SpatialGranularity.NEIGHBORHOOD
  if (zoom <= 17) return SpatialGranularity.ADDRESS
  return SpatialGranularity.COORDINATES
}

// ── Location Types ──

export interface Location {
  id: string
  name: string
  slug: string
  granularity: SpatialGranularity
  granularity_display: string
  parent: string | null
  path: string
  depth: number
  breadcrumb: string
  latitude: number | null
  longitude: number | null
  coordinates: { latitude: number; longitude: number } | null
  timezone_str: string
  children_count: number
}

// ── Calendar Source Types ──

export interface CalendarSource {
  id: string
  name: string
  source_type: 'google' | 'ics' | 'caldav' | 'outlook' | 'apple' | 'manual' | 'obsidian'
  source_type_display: string
  color: string
  is_visible: boolean
  is_active: boolean
  last_synced_at: string | null
  sync_error: string
  event_count: number
}

// ── Lunar Types (replaces IFC) ──

export type LunarPhaseName =
  | 'new_moon'
  | 'waxing_crescent'
  | 'first_quarter'
  | 'waxing_gibbous'
  | 'full_moon'
  | 'waning_gibbous'
  | 'last_quarter'
  | 'waning_crescent'

export interface LunarPhaseInfo {
  phase: LunarPhaseName
  emoji: string
  illumination: number // 0-1
  age: number // Days into synodic cycle (0-29.53)
  isEclipse: boolean
  eclipseType?: 'solar' | 'lunar' | 'penumbral'
}

export interface SynodicMonth {
  startDate: Date // New moon
  endDate: Date // Next new moon
  durationDays: number // ~29.53
  phases: Array<{
    date: Date
    phase: LunarPhaseName
    emoji: string
  }>
}

// ── r* Tool Integration Types ──

export type RToolName = 'rTrips' | 'rNetwork' | 'rMaps' | 'rCart' | 'rNotes' | 'standalone'

export interface RCalContext {
  tool: RToolName
  entityId?: string
  entityType?: string
  dateRange?: { start: Date; end: Date }
  highlights?: string[]
  filters?: Record<string, unknown>
  viewConfig?: {
    defaultTab?: TabView
    defaultGranularity?: TemporalGranularity
    showMap?: boolean
    readOnly?: boolean
  }
}

// ── Event Types ──

export interface UnifiedEvent {
  id: string
  source: string
  source_name: string
  source_color: string
  source_type: string
  external_id: string
  title: string
  description: string
  // Gregorian time
  start: string
  end: string
  all_day: boolean
  timezone_str: string
  rrule: string
  is_recurring: boolean
  // Location
  location: string | null
  location_raw: string
  location_display: string | null
  location_breadcrumb: string | null
  latitude: number | null
  longitude: number | null
  coordinates: { latitude: number; longitude: number } | null
  location_granularity: SpatialGranularity | null
  // Virtual
  is_virtual: boolean
  virtual_url: string
  virtual_platform: string
  // Participants
  organizer_name: string
  organizer_email: string
  attendees: Array<{ email: string; name?: string; status?: string }>
  attendee_count: number
  // Status
  status: 'confirmed' | 'tentative' | 'cancelled'
  visibility: 'default' | 'public' | 'private'
  // Computed
  duration_minutes: number
  is_upcoming: boolean
  is_ongoing: boolean
}

export interface EventListItem {
  id: string
  title: string
  start: string
  end: string
  all_day: boolean
  source: string
  source_color: string
  source_type?: string
  location_raw: string
  location_breadcrumb?: string | null
  is_virtual: boolean
  status: string
  // Coordinates (returned by API, used by map)
  latitude?: number | null
  longitude?: number | null
  coordinates?: { latitude: number; longitude: number } | null
  // Lunar data (computed client-side)
  lunarPhase?: LunarPhaseName
  lunarEmoji?: string
}

export interface RCalEvent extends UnifiedEvent {
  lunarPhase?: LunarPhaseInfo
  rToolSource?: RToolName
  rToolEntityId?: string
  eventCategory?: string
  metadata?: Record<string, unknown>
}

// ── Calendar View Types ──

export interface CalendarDay {
  date: Date
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  events: EventListItem[]
  lunar?: LunarPhaseInfo
}

export interface CalendarMonth {
  year: number
  month: number
  month_name: string
  days: CalendarDay[]
}

// ── Map Types ──

export interface MapState {
  center: [number, number] // [lat, lng]
  zoom: number
}
