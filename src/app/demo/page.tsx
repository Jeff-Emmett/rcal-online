'use client'

import { useState, useEffect, useCallback } from 'react'
import { Calendar as CalendarIcon, MapPin, Clock, ZoomIn, ZoomOut, Link2, Unlink2 } from 'lucide-react'
import { TemporalZoomController } from '@/components/calendar'
import { CalendarHeader } from '@/components/calendar/CalendarHeader'
import { CalendarSidebar } from '@/components/calendar/CalendarSidebar'
import { TabLayout } from '@/components/ui/TabLayout'
import { TemporalTab } from '@/components/tabs/TemporalTab'
import { SpatialTab } from '@/components/tabs/SpatialTab'
import { LunarTab } from '@/components/tabs/LunarTab'
import { ContextTab } from '@/components/tabs/ContextTab'
import { useCalendarStore, useEffectiveSpatialGranularity } from '@/lib/store'
import { TemporalGranularity, TEMPORAL_GRANULARITY_LABELS, GRANULARITY_LABELS } from '@/lib/types'
import type { TabView } from '@/lib/types'
import { DemoDataSeeder } from '@/components/DemoDataSeeder'

export default function DemoPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [zoomPanelOpen, setZoomPanelOpen] = useState(false)
  const {
    temporalGranularity,
    activeTab,
    setActiveTab,
    zoomCoupled,
    toggleZoomCoupled,
    zoomIn,
    zoomOut,
  } = useCalendarStore()
  const effectiveSpatial = useEffectiveSpatialGranularity()

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.ctrlKey || e.metaKey || e.altKey) return

      switch (e.key) {
        case 'l':
        case 'L':
          e.preventDefault()
          toggleZoomCoupled()
          break
        // Tab switching: 1-4
        case '1':
          e.preventDefault()
          setActiveTab('temporal')
          break
        case '2':
          e.preventDefault()
          setActiveTab('spatial')
          break
        case '3':
          e.preventDefault()
          setActiveTab('lunar')
          break
        case '4':
          e.preventDefault()
          setActiveTab('context')
          break
      }
    },
    [toggleZoomCoupled, setActiveTab]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Seed demo data into React Query cache */}
      <DemoDataSeeder />

      {/* Sidebar */}
      {sidebarOpen && (
        <CalendarSidebar onClose={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <CalendarHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        {/* Main area with optional zoom panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Tab layout */}
          <div className="flex-1 overflow-hidden">
            <TabLayout>
              {{
                temporal: <TemporalTab />,
                spatial: <SpatialTab />,
                lunar: <LunarTab />,
                context: <ContextTab />,
              }}
            </TabLayout>
          </div>

          {/* Zoom control panel (collapsible) */}
          {zoomPanelOpen && (
            <aside className="w-80 border-l border-gray-200 dark:border-gray-700 p-4 overflow-auto bg-white dark:bg-gray-800">
              <TemporalZoomController showSpatial={true} />
            </aside>
          )}
        </div>

        {/* Footer with calendar info and quick zoom controls */}
        <footer className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                Gregorian
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {TEMPORAL_GRANULARITY_LABELS[temporalGranularity]}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {GRANULARITY_LABELS[effectiveSpatial]}
              </span>
              {activeTab === 'spatial' && (
                <button
                  onClick={toggleZoomCoupled}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-colors ${
                    zoomCoupled
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={zoomCoupled ? 'Unlink spatial from temporal (L)' : 'Link spatial to temporal (L)'}
                >
                  {zoomCoupled ? <Link2 className="w-3 h-3" /> : <Unlink2 className="w-3 h-3" />}
                  {zoomCoupled ? 'Coupled' : 'Independent'}
                </button>
              )}
            </div>

            {/* Quick controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={zoomIn}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Zoom in (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={zoomOut}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Zoom out (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomPanelOpen(!zoomPanelOpen)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  zoomPanelOpen
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {zoomPanelOpen ? 'Hide' : 'Zoom Panel'}
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
