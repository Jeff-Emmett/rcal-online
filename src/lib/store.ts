'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CalendarType, ViewType, Location, SpatialGranularity, TabView, RCalContext } from '@/lib/types'
import { TemporalGranularity, TEMPORAL_TO_VIEW, TEMPORAL_TO_SPATIAL } from '@/lib/types'

interface CalendarState {
  // Calendar type
  calendarType: CalendarType
  setCalendarType: (type: CalendarType) => void
  toggleCalendarType: () => void

  // View type
  viewType: ViewType
  setViewType: (type: ViewType) => void

  // Active tab
  activeTab: TabView
  setActiveTab: (tab: TabView) => void

  // Temporal granularity (zoom level)
  temporalGranularity: TemporalGranularity
  setTemporalGranularity: (granularity: TemporalGranularity) => void
  zoomIn: () => void   // More detail (Year -> Month -> Week -> Day)
  zoomOut: () => void  // Less detail (Day -> Week -> Month -> Year)

  // Spatial granularity filter
  spatialGranularity: SpatialGranularity | null
  setSpatialGranularity: (granularity: SpatialGranularity | null) => void

  // Current date
  currentDate: Date
  setCurrentDate: (date: Date) => void
  goToToday: () => void
  goToNextMonth: () => void
  goToPreviousMonth: () => void
  goToNextYear: () => void
  goToPreviousYear: () => void
  goToNextDecade: () => void
  goToPreviousDecade: () => void
  navigateByGranularity: (direction: 'next' | 'prev') => void

  // Selected event
  selectedEventId: string | null
  setSelectedEventId: (id: string | null) => void

  // Location filter
  selectedLocation: Location | null
  setSelectedLocation: (location: Location | null) => void

  // Source filters (hiddenSources: sources to hide; empty = show all)
  hiddenSources: string[]
  toggleSourceVisibility: (sourceId: string) => void
  setHiddenSources: (sources: string[]) => void
  isSourceVisible: (sourceId: string) => boolean

  // UI state
  showLunarOverlay: boolean
  setShowLunarOverlay: (show: boolean) => void

  // Map panel
  mapVisible: boolean
  setMapVisible: (visible: boolean) => void
  toggleMap: () => void

  // Coupled zoom (temporal drives spatial)
  zoomCoupled: boolean
  setZoomCoupled: (coupled: boolean) => void
  toggleZoomCoupled: () => void

  // r* tool context
  rCalContext: RCalContext | null
  setRCalContext: (context: RCalContext | null) => void
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      // Calendar type
      calendarType: 'gregorian',
      setCalendarType: (calendarType) => set({ calendarType }),
      toggleCalendarType: () =>
        set((state) => ({
          calendarType: state.calendarType === 'gregorian' ? 'lunar' : 'gregorian',
        })),

      // View type
      viewType: 'month',
      setViewType: (viewType) => set({ viewType }),

      // Active tab
      activeTab: 'temporal',
      setActiveTab: (activeTab) => set({ activeTab }),

      // Temporal granularity
      temporalGranularity: TemporalGranularity.MONTH,
      setTemporalGranularity: (granularity) => {
        const view = TEMPORAL_TO_VIEW[granularity]
        const coupled = get().zoomCoupled
        set({
          temporalGranularity: granularity,
          ...(view && { viewType: view }),
          ...(coupled && { spatialGranularity: TEMPORAL_TO_SPATIAL[granularity] }),
        })
      },
      zoomIn: () =>
        set((state) => {
          const newGranularity = Math.max(
            TemporalGranularity.DAY,
            state.temporalGranularity - 1
          ) as TemporalGranularity
          const view = TEMPORAL_TO_VIEW[newGranularity]
          return {
            temporalGranularity: newGranularity,
            ...(view && { viewType: view }),
            ...(state.zoomCoupled && { spatialGranularity: TEMPORAL_TO_SPATIAL[newGranularity] }),
          }
        }),
      zoomOut: () =>
        set((state) => {
          const newGranularity = Math.min(
            TemporalGranularity.DECADE,
            state.temporalGranularity + 1
          ) as TemporalGranularity
          const view = TEMPORAL_TO_VIEW[newGranularity]
          return {
            temporalGranularity: newGranularity,
            ...(view && { viewType: view }),
            ...(state.zoomCoupled && { spatialGranularity: TEMPORAL_TO_SPATIAL[newGranularity] }),
          }
        }),

      // Spatial granularity
      spatialGranularity: null,
      setSpatialGranularity: (spatialGranularity) => set({ spatialGranularity }),

      // Current date
      currentDate: new Date(),
      setCurrentDate: (currentDate) => set({ currentDate }),
      goToToday: () => set({ currentDate: new Date() }),
      goToNextMonth: () =>
        set((state) => {
          const next = new Date(state.currentDate)
          next.setMonth(next.getMonth() + 1)
          return { currentDate: next }
        }),
      goToPreviousMonth: () =>
        set((state) => {
          const prev = new Date(state.currentDate)
          prev.setMonth(prev.getMonth() - 1)
          return { currentDate: prev }
        }),
      goToNextYear: () =>
        set((state) => {
          const next = new Date(state.currentDate)
          next.setFullYear(next.getFullYear() + 1)
          return { currentDate: next }
        }),
      goToPreviousYear: () =>
        set((state) => {
          const prev = new Date(state.currentDate)
          prev.setFullYear(prev.getFullYear() - 1)
          return { currentDate: prev }
        }),
      goToNextDecade: () =>
        set((state) => {
          const next = new Date(state.currentDate)
          next.setFullYear(next.getFullYear() + 10)
          return { currentDate: next }
        }),
      goToPreviousDecade: () =>
        set((state) => {
          const prev = new Date(state.currentDate)
          prev.setFullYear(prev.getFullYear() - 10)
          return { currentDate: prev }
        }),
      navigateByGranularity: (direction) =>
        set((state) => {
          const current = new Date(state.currentDate)
          const delta = direction === 'next' ? 1 : -1

          switch (state.temporalGranularity) {
            case TemporalGranularity.DAY:
              current.setDate(current.getDate() + delta)
              break
            case TemporalGranularity.WEEK:
              current.setDate(current.getDate() + delta * 7)
              break
            case TemporalGranularity.MONTH:
              current.setMonth(current.getMonth() + delta)
              break
            case TemporalGranularity.SEASON:
              current.setMonth(current.getMonth() + delta * 3)
              break
            case TemporalGranularity.YEAR:
              current.setFullYear(current.getFullYear() + delta)
              break
            case TemporalGranularity.DECADE:
              current.setFullYear(current.getFullYear() + delta * 10)
              break
            case TemporalGranularity.CENTURY:
              current.setFullYear(current.getFullYear() + delta * 100)
              break
            default:
              current.setDate(current.getDate() + delta)
          }

          return { currentDate: current }
        }),

      // Selected event
      selectedEventId: null,
      setSelectedEventId: (selectedEventId) => set({ selectedEventId }),

      // Location filter
      selectedLocation: null,
      setSelectedLocation: (selectedLocation) => set({ selectedLocation }),

      // Source filters (hiddenSources: sources to hide; empty = show all)
      hiddenSources: [],
      toggleSourceVisibility: (sourceId) =>
        set((state) => ({
          hiddenSources: state.hiddenSources.includes(sourceId)
            ? state.hiddenSources.filter((id) => id !== sourceId)
            : [...state.hiddenSources, sourceId],
        })),
      setHiddenSources: (hiddenSources) => set({ hiddenSources }),
      isSourceVisible: (sourceId) => !get().hiddenSources.includes(sourceId),

      // UI state
      showLunarOverlay: false,
      setShowLunarOverlay: (showLunarOverlay) => set({ showLunarOverlay }),

      // Map panel
      mapVisible: true,
      setMapVisible: (mapVisible) => set({ mapVisible }),
      toggleMap: () => set((state) => ({ mapVisible: !state.mapVisible })),

      // Coupled zoom
      zoomCoupled: true,
      setZoomCoupled: (zoomCoupled) => set({ zoomCoupled }),
      toggleZoomCoupled: () =>
        set((state) => {
          const newCoupled = !state.zoomCoupled
          return {
            zoomCoupled: newCoupled,
            // When re-coupling, sync spatial to current temporal
            ...(newCoupled && { spatialGranularity: TEMPORAL_TO_SPATIAL[state.temporalGranularity] }),
          }
        }),

      // r* tool context
      rCalContext: null,
      setRCalContext: (rCalContext) => set({ rCalContext }),
    }),
    {
      name: 'calendar-store',
      version: 3,
      partialize: (state) => ({
        calendarType: state.calendarType,
        viewType: state.viewType,
        activeTab: state.activeTab,
        temporalGranularity: state.temporalGranularity,
        spatialGranularity: state.spatialGranularity,
        showLunarOverlay: state.showLunarOverlay,
        hiddenSources: state.hiddenSources,
        mapVisible: state.mapVisible,
        zoomCoupled: state.zoomCoupled,
      }),
    }
  )
)

/** Selector: returns the effective spatial granularity (coupled or manual). */
export function useEffectiveSpatialGranularity(): SpatialGranularity {
  return useCalendarStore((state) => {
    if (state.zoomCoupled) {
      return TEMPORAL_TO_SPATIAL[state.temporalGranularity]
    }
    return state.spatialGranularity ?? TEMPORAL_TO_SPATIAL[TemporalGranularity.MONTH]
  })
}
