'use client'

import { useMemo } from 'react'
import { Moon } from 'lucide-react'
import { useCalendarStore } from '@/lib/store'
import { getLunarPhaseForDate, getSynodicMonth } from '@/lib/lunar'
import type { LunarPhaseName } from '@/lib/types'

const PHASE_COLORS: Record<LunarPhaseName, string> = {
  new_moon: 'bg-lunar-new',
  waxing_crescent: 'bg-lunar-waxing',
  first_quarter: 'bg-lunar-first',
  waxing_gibbous: 'bg-lunar-gibbous',
  full_moon: 'bg-lunar-full',
  waning_gibbous: 'bg-lunar-waning',
  last_quarter: 'bg-lunar-last',
  waning_crescent: 'bg-lunar-crescent',
}

export function LunarTab() {
  const { currentDate } = useCalendarStore()

  const todayPhase = useMemo(() => getLunarPhaseForDate(currentDate), [currentDate])
  const synodicMonth = useMemo(() => getSynodicMonth(currentDate), [currentDate])

  // Progress through current synodic month (0-1)
  const progress = useMemo(() => {
    const elapsed = currentDate.getTime() - synodicMonth.startDate.getTime()
    const total = synodicMonth.endDate.getTime() - synodicMonth.startDate.getTime()
    return Math.max(0, Math.min(1, elapsed / total))
  }, [currentDate, synodicMonth])

  return (
    <main className="h-full overflow-auto p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Current phase hero */}
        <div className="text-center space-y-4">
          <div className="text-8xl">{todayPhase.emoji}</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
            {todayPhase.phase.replace(/_/g, ' ')}
          </h2>
          <div className="flex justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span>Illumination: {(todayPhase.illumination * 100).toFixed(1)}%</span>
            <span>Age: {todayPhase.age.toFixed(1)} days</span>
            <span>Cycle: {synodicMonth.durationDays.toFixed(1)} days</span>
          </div>
          {todayPhase.isEclipse && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-medium">
              Eclipse{todayPhase.eclipseType ? ` (${todayPhase.eclipseType})` : ''}
            </div>
          )}
        </div>

        {/* Synodic month progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>New Moon: {synodicMonth.startDate.toLocaleDateString()}</span>
            <span>Next New Moon: {synodicMonth.endDate.toLocaleDateString()}</span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-lunar-new via-lunar-full to-lunar-new rounded-full transition-all"
              style={{ width: `${progress * 100}%` }}
            />
            {/* Phase markers */}
            {synodicMonth.phases.map((p, i) => {
              const phaseProgress =
                (p.date.getTime() - synodicMonth.startDate.getTime()) /
                (synodicMonth.endDate.getTime() - synodicMonth.startDate.getTime())
              return (
                <div
                  key={i}
                  className="absolute top-0 h-full flex items-center"
                  style={{ left: `${phaseProgress * 100}%` }}
                  title={`${p.emoji} ${p.phase.replace(/_/g, ' ')}\n${p.date.toLocaleDateString()}`}
                >
                  <span className="text-xs -translate-x-1/2">{p.emoji}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Phase timeline */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Moon className="w-5 h-5" />
            Phases this cycle
          </h3>
          <div className="grid gap-2">
            {synodicMonth.phases.map((phase, i) => {
              const isPast = phase.date < currentDate
              const isCurrent = phase.phase === todayPhase.phase
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    isCurrent
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : isPast
                        ? 'border-gray-200 dark:border-gray-700 opacity-60'
                        : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <span className="text-2xl">{phase.emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white capitalize">
                      {phase.phase.replace(/_/g, ' ')}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {phase.date.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${PHASE_COLORS[phase.phase]}`}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
