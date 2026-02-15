'use client'

import { useEffect, useRef, useMemo } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, useMapEvents } from 'react-leaflet'
import { useCalendarStore, useEffectiveSpatialGranularity } from '@/lib/store'
import { useMapState } from '@/hooks/useMapState'
import { getSemanticLocationLabel } from '@/lib/location'
import { SpatialGranularity, SPATIAL_TO_LEAFLET_ZOOM, GRANULARITY_LABELS, leafletZoomToSpatial } from '@/lib/types'
import type { EventListItem, UnifiedEvent } from '@/lib/types'
import { clsx } from 'clsx'

// Fix Leaflet default marker icons for Next.js bundling
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
})

interface SpatioTemporalMapProps {
  events: EventListItem[]
}

/** Syncs the Leaflet map viewport with the Zustand store. */
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  const isUserInteraction = useRef(false)
  const { setSpatialGranularity, zoomCoupled } = useCalendarStore()
  const prevCenter = useRef(center)
  const prevZoom = useRef(zoom)

  // Sync store → map (animate when the store changes)
  useEffect(() => {
    if (isUserInteraction.current) {
      isUserInteraction.current = false
      return
    }
    if (prevCenter.current[0] !== center[0] || prevCenter.current[1] !== center[1] || prevZoom.current !== zoom) {
      map.flyTo(center, zoom, { duration: 0.8 })
      prevCenter.current = center
      prevZoom.current = zoom
    }
  }, [map, center, zoom])

  // Sync map → store (when user manually zooms/pans)
  useMapEvents({
    zoomend: () => {
      const mapZoom = map.getZoom()
      if (Math.abs(mapZoom - zoom) > 0.5 && !zoomCoupled) {
        isUserInteraction.current = true
        setSpatialGranularity(leafletZoomToSpatial(mapZoom))
      }
    },
  })

  return null
}

/** Renders event markers, clustering at broad zooms. */
function EventMarkers({ events }: { events: EventListItem[] }) {
  const spatialGranularity = useEffectiveSpatialGranularity()
  const isBroadZoom = spatialGranularity <= SpatialGranularity.COUNTRY

  // Group events with coordinates by semantic location at broad zooms
  const markers = useMemo(() => {
    // Filter events that have coordinate-like data embedded in location_raw
    // (EventListItem doesn't have lat/lng directly, so we pass through all events
    // and rely on the full UnifiedEvent type if available)
    const eventsWithCoords = events.filter((e) => {
      const ev = e as EventListItem & { latitude?: number | null; longitude?: number | null }
      return ev.latitude != null && ev.longitude != null
    }) as (EventListItem & { latitude: number; longitude: number })[]

    if (!isBroadZoom) {
      // Fine zoom: individual markers
      return eventsWithCoords.map((e) => ({
        key: e.id,
        lat: e.latitude,
        lng: e.longitude,
        label: e.title,
        locationLabel: getSemanticLocationLabel(e, spatialGranularity),
        color: e.source_color || '#3b82f6',
        count: 1,
        events: [e],
      }))
    }

    // Broad zoom: cluster by semantic location
    const groups = new Map<string, { events: (EventListItem & { latitude: number; longitude: number })[]; sumLat: number; sumLng: number }>()
    for (const e of eventsWithCoords) {
      const label = getSemanticLocationLabel(e, spatialGranularity)
      const key = label || `${e.latitude.toFixed(1)},${e.longitude.toFixed(1)}`
      const group = groups.get(key) || { events: [], sumLat: 0, sumLng: 0 }
      group.events.push(e)
      group.sumLat += e.latitude
      group.sumLng += e.longitude
      groups.set(key, group)
    }

    return Array.from(groups.entries()).map(([label, group]) => ({
      key: label,
      lat: group.sumLat / group.events.length,
      lng: group.sumLng / group.events.length,
      label,
      locationLabel: label,
      color: group.events[0].source_color || '#3b82f6',
      count: group.events.length,
      events: group.events,
    }))
  }, [events, spatialGranularity, isBroadZoom])

  const markerRadius = isBroadZoom ? 12 : 6

  return (
    <>
      {markers.map((marker) => (
        <CircleMarker
          key={marker.key}
          center={[marker.lat, marker.lng]}
          radius={marker.count > 1 ? Math.min(markerRadius + Math.log2(marker.count) * 3, 24) : markerRadius}
          pathOptions={{
            color: marker.color,
            fillColor: marker.color,
            fillOpacity: 0.7,
            weight: 2,
          }}
        >
          <Popup>
            <div className="text-sm">
              {marker.count > 1 ? (
                <>
                  <div className="font-semibold mb-1">{marker.locationLabel}</div>
                  <div className="text-gray-500">{marker.count} events</div>
                  <ul className="mt-1 space-y-0.5 max-h-32 overflow-auto">
                    {marker.events.slice(0, 5).map((e) => (
                      <li key={e.id} className="text-xs">{e.title}</li>
                    ))}
                    {marker.count > 5 && (
                      <li className="text-xs text-gray-400">+{marker.count - 5} more</li>
                    )}
                  </ul>
                </>
              ) : (
                <>
                  <div className="font-semibold">{marker.label}</div>
                  {marker.locationLabel && marker.locationLabel !== marker.label && (
                    <div className="text-xs text-gray-500">{marker.locationLabel}</div>
                  )}
                  {!marker.events[0].all_day && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {new Date(marker.events[0].start).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </>
  )
}

export function SpatioTemporalMap({ events }: SpatioTemporalMapProps) {
  const { center, zoom } = useMapState(events)
  const spatialGranularity = useEffectiveSpatialGranularity()
  const { zoomCoupled, toggleZoomCoupled } = useCalendarStore()

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={center} zoom={zoom} />
        <EventMarkers events={events} />
      </MapContainer>

      {/* Overlay: granularity indicator + coupling toggle */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md px-3 py-2 text-xs">
          <div className="text-gray-500 dark:text-gray-400">
            {GRANULARITY_LABELS[spatialGranularity]}
          </div>
        </div>
        <button
          onClick={toggleZoomCoupled}
          className={clsx(
            'bg-white dark:bg-gray-800 rounded-lg shadow-md px-3 py-2 text-xs transition-colors',
            zoomCoupled
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400'
          )}
          title={zoomCoupled ? 'Unlink spatial from temporal zoom' : 'Link spatial to temporal zoom'}
        >
          {zoomCoupled ? '🔗' : '🔓'}
        </button>
      </div>
    </div>
  )
}
