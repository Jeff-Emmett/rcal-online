'use client'

import dynamic from 'next/dynamic'
import type { EventListItem } from '@/lib/types'

const SpatioTemporalMapInner = dynamic(
  () => import('./SpatioTemporalMap').then((mod) => mod.SpatioTemporalMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span className="text-sm text-gray-400">Loading map...</span>
        </div>
      </div>
    ),
  }
)

interface Props {
  events: EventListItem[]
}

export function SpatioTemporalMap({ events }: Props) {
  return <SpatioTemporalMapInner events={events} />
}
