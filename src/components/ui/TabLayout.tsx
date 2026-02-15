'use client'

import { Calendar, Map, Moon, Layers } from 'lucide-react'
import { useCalendarStore } from '@/lib/store'
import type { TabView } from '@/lib/types'
import { clsx } from 'clsx'

const TABS: Array<{
  id: TabView
  label: string
  icon: typeof Calendar
  shortcut: string
}> = [
  { id: 'temporal', label: 'Temporal', icon: Calendar, shortcut: '1' },
  { id: 'spatial', label: 'Spatial', icon: Map, shortcut: '2' },
  { id: 'lunar', label: 'Lunar', icon: Moon, shortcut: '3' },
  { id: 'context', label: 'Context', icon: Layers, shortcut: '4' },
]

interface TabLayoutProps {
  children: Record<TabView, React.ReactNode>
}

export function TabLayout({ children }: TabLayoutProps) {
  const { activeTab, setActiveTab, rCalContext } = useCalendarStore()

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2">
        {TABS.map((tab) => {
          const isDisabled = tab.id === 'context' && !rCalContext
          const isActive = activeTab === tab.id
          const Icon = tab.icon

          return (
            <button
              key={tab.id}
              onClick={() => !isDisabled && setActiveTab(tab.id)}
              disabled={isDisabled}
              className={clsx(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
                isActive
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400',
                !isActive && !isDisabled && 'hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300',
                isDisabled && 'opacity-40 cursor-not-allowed'
              )}
              title={
                isDisabled
                  ? 'Open rcal from an r* tool to use Context view'
                  : `${tab.label} view (${tab.shortcut})`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{tab.id === 'context' && rCalContext ? rCalContext.tool : tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {children[activeTab]}
      </div>
    </div>
  )
}
