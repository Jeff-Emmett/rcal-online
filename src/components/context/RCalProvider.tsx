'use client'

import { useEffect } from 'react'
import { useCalendarStore } from '@/lib/store'
import type { RCalContext } from '@/lib/types'

interface RCalProviderProps {
  context: RCalContext
  children: React.ReactNode
}

/**
 * Provider component that sets the r* tool context in the store.
 * On mount, sets the context and optionally switches to the context tab.
 * On unmount, clears the context.
 */
export function RCalProvider({ context, children }: RCalProviderProps) {
  const { setRCalContext, setActiveTab, setTemporalGranularity } = useCalendarStore()

  useEffect(() => {
    setRCalContext(context)

    // Apply view config overrides from the calling tool
    if (context.viewConfig?.defaultTab) {
      setActiveTab(context.viewConfig.defaultTab)
    } else {
      setActiveTab('context')
    }

    if (context.viewConfig?.defaultGranularity !== undefined) {
      setTemporalGranularity(context.viewConfig.defaultGranularity)
    }

    return () => {
      setRCalContext(null)
    }
  }, [context, setRCalContext, setActiveTab, setTemporalGranularity])

  return <>{children}</>
}
