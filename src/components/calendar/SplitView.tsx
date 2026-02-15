'use client'

import { Panel, Group, Separator } from 'react-resizable-panels'
import { useCalendarStore } from '@/lib/store'
import { SpatioTemporalMap } from './SpatioTemporalMapLoader'
import type { EventListItem } from '@/lib/types'

interface SplitViewProps {
  calendarContent: React.ReactNode
  events: EventListItem[]
}

export function SplitView({ calendarContent, events }: SplitViewProps) {
  const { mapVisible } = useCalendarStore()

  if (!mapVisible) {
    return <>{calendarContent}</>
  }

  return (
    <Group orientation="horizontal" id="calendar-map-split">
      {/* Calendar panel */}
      <Panel defaultSize="60%" minSize="30%">
        <div className="h-full overflow-auto p-4">
          {calendarContent}
        </div>
      </Panel>

      {/* Resize handle */}
      <Separator className="w-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-600 transition-colors cursor-col-resize" />

      {/* Map panel */}
      <Panel defaultSize="40%" minSize="20%">
        <SpatioTemporalMap events={events} />
      </Panel>
    </Group>
  )
}
