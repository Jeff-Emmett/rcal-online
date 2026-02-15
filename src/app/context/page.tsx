'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { RCalProvider } from '@/components/context/RCalProvider'
import { TabLayout } from '@/components/ui/TabLayout'
import { TemporalTab } from '@/components/tabs/TemporalTab'
import { SpatialTab } from '@/components/tabs/SpatialTab'
import { LunarTab } from '@/components/tabs/LunarTab'
import { ContextTab } from '@/components/tabs/ContextTab'
import { CalendarHeader } from '@/components/calendar/CalendarHeader'
import type { RCalContext, RToolName, TabView, TemporalGranularity } from '@/lib/types'

const VALID_TOOLS: RToolName[] = ['rTrips', 'rNetwork', 'rMaps', 'rCart', 'rNotes', 'standalone']

function ContextPageInner() {
  const searchParams = useSearchParams()

  const tool = searchParams.get('tool') as RToolName | null
  const entityId = searchParams.get('entityId') || undefined
  const entityType = searchParams.get('entityType') || undefined
  const defaultTab = searchParams.get('tab') as TabView | undefined
  const startDate = searchParams.get('start')
  const endDate = searchParams.get('end')

  if (!tool || !VALID_TOOLS.includes(tool)) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4 max-w-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Invalid context
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Missing or invalid <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">tool</code> parameter.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Valid tools: {VALID_TOOLS.join(', ')}
          </p>
          <p className="text-sm text-gray-400">
            Example: <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">/context?tool=rTrips&entityId=trip-123</code>
          </p>
        </div>
      </div>
    )
  }

  const context: RCalContext = {
    tool,
    entityId,
    entityType,
    dateRange:
      startDate && endDate
        ? { start: new Date(startDate), end: new Date(endDate) }
        : undefined,
    viewConfig: {
      defaultTab: defaultTab || 'context',
    },
  }

  return (
    <RCalProvider context={context}>
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
        <CalendarHeader
          onToggleSidebar={() => {}}
          sidebarOpen={false}
        />
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
      </div>
    </RCalProvider>
  )
}

export default function ContextPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-gray-500">Loading context...</div>
        </div>
      }
    >
      <ContextPageInner />
    </Suspense>
  )
}
