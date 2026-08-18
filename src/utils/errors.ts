import type { ApiError } from '@/types'

export function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'message' in error && 'status' in error
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (isApiError(error)) return error.message
  if (error instanceof Error) return error.message
  return fallback
}

/**
 * ASP.NET Core's automatic ModelState validation errors are keyed by the C# property name
 * (PascalCase, e.g. "FirstName"), not the camelCase name our forms use - check both.
 */
export function fieldError(error: unknown, name: string): string | undefined {
  if (!isApiError(error) || !error.fieldErrors) return undefined
  const pascal = name.charAt(0).toUpperCase() + name.slice(1)
  return error.fieldErrors[pascal]?.[0] ?? error.fieldErrors[name]?.[0]
}
