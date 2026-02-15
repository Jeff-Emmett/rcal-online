import { Moon } from 'lunarphase-js'
import SunCalc from 'suncalc'
import type { LunarPhaseInfo, LunarPhaseName, SynodicMonth } from './types'

// ── Phase mapping ──

const PHASE_EMOJIS: Record<LunarPhaseName, string> = {
  new_moon: '\u{1F311}',
  waxing_crescent: '\u{1F312}',
  first_quarter: '\u{1F313}',
  waxing_gibbous: '\u{1F314}',
  full_moon: '\u{1F315}',
  waning_gibbous: '\u{1F316}',
  last_quarter: '\u{1F317}',
  waning_crescent: '\u{1F318}',
}

/**
 * Maps lunarphase-js phase name to our LunarPhaseName type.
 */
function normalizePhaseName(phaseName: string): LunarPhaseName {
  const normalized = phaseName
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/-/g, '_')

  const mapping: Record<string, LunarPhaseName> = {
    new: 'new_moon',
    new_moon: 'new_moon',
    waxing_crescent: 'waxing_crescent',
    first_quarter: 'first_quarter',
    waxing_gibbous: 'waxing_gibbous',
    full: 'full_moon',
    full_moon: 'full_moon',
    waning_gibbous: 'waning_gibbous',
    third_quarter: 'last_quarter',
    last_quarter: 'last_quarter',
    waning_crescent: 'waning_crescent',
  }

  return mapping[normalized] || 'new_moon'
}

/**
 * Get lunar phase info for a specific date.
 * Uses lunarphase-js for phase name/age and suncalc for illumination fraction.
 */
export function getLunarPhaseForDate(date: Date): LunarPhaseInfo {
  const phaseName = Moon.lunarPhase(date)
  const age = Moon.lunarAge(date)
  const phase = normalizePhaseName(phaseName)

  // suncalc gives precise illumination fraction (0-1)
  const sunCalcIllum = SunCalc.getMoonIllumination(date)

  return {
    phase,
    emoji: PHASE_EMOJIS[phase],
    illumination: sunCalcIllum.fraction,
    age,
    isEclipse: false, // Basic implementation; eclipse detection is complex
  }
}

/**
 * Find the nearest new moon before or on the given date.
 * Uses suncalc illumination fraction for precise minimum detection.
 */
function findPreviousNewMoon(date: Date): Date {
  const d = new Date(date)
  let minIllum = 1
  let minDate = new Date(d)

  for (let i = 0; i <= 30; i++) {
    const check = new Date(d)
    check.setDate(d.getDate() - i)
    const illum = SunCalc.getMoonIllumination(check).fraction
    if (illum < minIllum) {
      minIllum = illum
      minDate = new Date(check)
    }
    // If illumination is rising again and we passed a minimum, stop
    if (illum > minIllum + 0.05 && minIllum < 0.05) break
  }

  return minDate
}

/**
 * Find the next new moon after the given date.
 */
function findNextNewMoon(date: Date): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + 1) // Start from tomorrow
  let minIllum = 1
  let minDate = new Date(d)

  for (let i = 0; i <= 30; i++) {
    const check = new Date(d)
    check.setDate(d.getDate() + i)
    const illum = SunCalc.getMoonIllumination(check).fraction
    if (illum < minIllum) {
      minIllum = illum
      minDate = new Date(check)
    }
    if (illum > minIllum + 0.05 && minIllum < 0.05) break
  }

  return minDate
}

/**
 * Get the synodic month containing the given date.
 * Returns the new moon boundaries and all 8 major phases.
 */
export function getSynodicMonth(date: Date): SynodicMonth {
  const startDate = findPreviousNewMoon(date)
  const endDate = findNextNewMoon(startDate)
  const durationDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)

  // Calculate approximate dates for each major phase
  const phaseOffsets: Array<{ fraction: number; phase: LunarPhaseName }> = [
    { fraction: 0, phase: 'new_moon' },
    { fraction: 0.125, phase: 'waxing_crescent' },
    { fraction: 0.25, phase: 'first_quarter' },
    { fraction: 0.375, phase: 'waxing_gibbous' },
    { fraction: 0.5, phase: 'full_moon' },
    { fraction: 0.625, phase: 'waning_gibbous' },
    { fraction: 0.75, phase: 'last_quarter' },
    { fraction: 0.875, phase: 'waning_crescent' },
  ]

  const phases = phaseOffsets.map(({ fraction, phase }) => {
    const phaseDate = new Date(startDate.getTime() + fraction * durationDays * 24 * 60 * 60 * 1000)
    return {
      date: phaseDate,
      phase,
      emoji: PHASE_EMOJIS[phase],
    }
  })

  return {
    startDate,
    endDate,
    durationDays,
    phases,
  }
}

/**
 * Batch compute lunar data for a date range.
 * Returns a Map keyed by ISO date string (YYYY-MM-DD).
 */
export function getLunarDataForRange(
  start: Date,
  end: Date
): Map<string, LunarPhaseInfo> {
  const result = new Map<string, LunarPhaseInfo>()
  const current = new Date(start)

  while (current <= end) {
    const key = current.toISOString().split('T')[0]
    result.set(key, getLunarPhaseForDate(current))
    current.setDate(current.getDate() + 1)
  }

  return result
}

/**
 * Get moonrise/moonset times for a specific date and location.
 * Uses suncalc for location-aware calculations.
 */
export function getMoonTimesForLocation(
  date: Date,
  lat: number,
  lng: number
): { rise: Date | undefined; set: Date | undefined; alwaysUp: boolean; alwaysDown: boolean } {
  const times = SunCalc.getMoonTimes(date, lat, lng)
  return {
    rise: times.rise || undefined,
    set: times.set || undefined,
    alwaysUp: !!times.alwaysUp,
    alwaysDown: !!times.alwaysDown,
  }
}

/**
 * Get moon position (altitude, azimuth, distance) for a specific date and location.
 */
export function getMoonPosition(
  date: Date,
  lat: number,
  lng: number
): { altitude: number; azimuth: number; distance: number; parallacticAngle: number } {
  return SunCalc.getMoonPosition(date, lat, lng)
}
