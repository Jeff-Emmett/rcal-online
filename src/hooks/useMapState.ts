'use client'

import { useMemo } from 'react'
import { useEffectiveSpatialGranularity } from '@/lib/store'
import { SPATIAL_TO_LEAFLET_ZOOM } from '@/lib/types'
import type { MapState, EventListItem } from '@/lib/types'

const WORLD_CENTER: [number, number] = [30, 0]

interface EventWithCoords {
  latitude?: number | null
  longitude?: number | null
  coordinates?: { latitude: number; longitude: number } | null
}

/**
 * Computes map center and zoom from events and the current spatial granularity.
 * Center is the centroid of all events with coordinates.
 * Zoom is derived from the effective spatial granularity.
 */
export function useMapState(events: (EventListItem & EventWithCoords)[]): MapState {
  const spatialGranularity = useEffectiveSpatialGranularity()

  const center = useMemo<[number, number]>(() => {
    const withCoords = events.filter((e) => {
      if (e.coordinates) return true
      if ('latitude' in e && e.latitude != null && 'longitude' in e && e.longitude != null) return true
      return false
    })

    if (withCoords.length === 0) return WORLD_CENTER

    let sumLat = 0
    let sumLng = 0
    for (const e of withCoords) {
      if (e.coordinates) {
        sumLat += e.coordinates.latitude
        sumLng += e.coordinates.longitude
      } else if ('latitude' in e && e.latitude != null && 'longitude' in e && e.longitude != null) {
        sumLat += e.latitude
        sumLng += e.longitude
      }
    }

    return [sumLat / withCoords.length, sumLng / withCoords.length]
  }, [events])

  const zoom = SPATIAL_TO_LEAFLET_ZOOM[spatialGranularity]

  return { center, zoom }
}
