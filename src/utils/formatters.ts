import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function formatDate(value?: string | null, pattern = 'MMM d, yyyy'): string {
  if (!value) return '—'
  try {
    return format(parseISO(value), pattern)
  } catch {
    return '—'
  }
}

export function formatDateTime(value?: string | null): string {
  return formatDate(value, 'MMM d, yyyy · h:mm a')
}

export function formatTime(value?: string | null): string {
  return formatDate(value, 'h:mm a')
}

export function formatRelativeTime(value?: string | null): string {
  if (!value) return ''
  try {
    return formatDistanceToNow(parseISO(value), { addSuffix: true })
  } catch {
    return ''
  }
}

export function initials(firstName?: string | null, lastName?: string | null): string {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || '?'
}

export function fullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim()
}

/** Converts an ISO datetime string from the API into the "YYYY-MM-DD" shape <input type="date"> expects. */
export function toDateInputValue(value?: string | null): string {
  if (!value) return ''
  return value.slice(0, 10)
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex++
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`
}
