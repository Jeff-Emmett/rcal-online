'use client'

import { Providers } from '@/providers'
import { RCalProvider } from '@/components/context/RCalProvider'
import { TabLayout } from '@/components/ui/TabLayout'
import { TemporalTab } from '@/components/tabs/TemporalTab'
import { SpatialTab } from '@/components/tabs/SpatialTab'
import { LunarTab } from '@/components/tabs/LunarTab'
import { ContextTab } from '@/components/tabs/ContextTab'
import type { RCalContext } from './types'

interface RCalEmbedProps {
  context: RCalContext
  className?: string
}

/**
 * Embeddable rCal component for other r* tools to import directly.
 * Wraps the full tab layout with providers and context.
 *
 * Usage:
 * ```tsx
 * import { RCalEmbed } from 'rcal-online/embed'
 *
 * <RCalEmbed context={{ tool: 'rTrips', entityId: 'trip-123' }} />
 * ```
 */
export function RCalEmbed({ context, className }: RCalEmbedProps) {
  return (
    <Providers>
      <RCalProvider context={context}>
        <div className={className || 'h-full'}>
          <TabLayout>
            {{
              temporal: <TemporalTab />,
              spatial: <SpatialTab />,
              lunar: <LunarTab />,
              context: <ContextTab />,
            }}
          </TabLayout>
        </div>
      </RCalProvider>
    </Providers>
  )
}
