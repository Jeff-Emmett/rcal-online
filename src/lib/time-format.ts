/**
 * Timezone-aware time formatting utilities.
 * Uses Intl.DateTimeFormat (built-in, no dependencies).
 */

export function formatEventTime(isoString: string, timezone: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
  })
}

export function formatEventTimeRange(
  start: string,
  end: string,
  timezone: string
): string {
  return `${formatEventTime(start, timezone)} \u2013 ${formatEventTime(end, timezone)}`
}

export function getTimezoneAbbreviation(timezone: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    }).formatToParts(new Date())
    return parts.find((p) => p.type === 'timeZoneName')?.value || timezone
  } catch {
    return timezone
  }
}
