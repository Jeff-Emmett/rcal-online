import { SpatialGranularity, UnifiedEvent, EventListItem } from './types'

/**
 * Returns the best location string for an event given the current spatial zoom level.
 */
export function getSemanticLocationLabel(
  event: UnifiedEvent | EventListItem,
  spatialGranularity: SpatialGranularity
): string {
  if (!('location_display' in event)) {
    return (event as EventListItem).location_raw || ''
  }

  const e = event as UnifiedEvent

  if (!e.location_raw && !e.location_display) {
    return e.is_virtual ? (e.virtual_platform || 'Virtual') : ''
  }

  const crumbs = e.location_breadcrumb?.split(' > ') || []

  if (crumbs.length === 0) {
    return e.location_display || e.location_raw || ''
  }

  switch (spatialGranularity) {
    case SpatialGranularity.PLANET:
      return crumbs[0] || 'Earth'
    case SpatialGranularity.CONTINENT:
      return crumbs[1] || crumbs[0] || e.location_display || ''
    case SpatialGranularity.BIOREGION:
    case SpatialGranularity.COUNTRY:
      return crumbs[2] || crumbs[1] || e.location_display || ''
    case SpatialGranularity.REGION:
      return crumbs[3] || crumbs[2] || e.location_display || ''
    case SpatialGranularity.CITY:
      return crumbs[3] || crumbs[2] || e.location_display || e.location_raw
    case SpatialGranularity.NEIGHBORHOOD:
      return crumbs.slice(-2).join(', ') || e.location_display || e.location_raw
    case SpatialGranularity.ADDRESS:
    case SpatialGranularity.COORDINATES:
      return e.location_raw || e.location_display || ''
    default:
      return e.location_display || e.location_raw || ''
  }
}

/**
 * Groups events by their semantic location at the given granularity.
 */
export function groupEventsByLocation(
  events: UnifiedEvent[],
  spatialGranularity: SpatialGranularity
): Map<string, UnifiedEvent[]> {
  const grouped = new Map<string, UnifiedEvent[]>()

  for (const event of events) {
    const label = getSemanticLocationLabel(event, spatialGranularity)
    if (!label) continue
    const existing = grouped.get(label) || []
    existing.push(event)
    grouped.set(label, existing)
  }

  return grouped
}
