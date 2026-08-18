/** Normalized shape every API failure is coerced into by api/client.ts, regardless of backend response format. */
export interface ApiError {
  status: number | null
  message: string
  fieldErrors?: Record<string, string[]>
}
