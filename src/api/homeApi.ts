import { apiClient } from './client'
import type { Home } from '@/types'

// GET /api/home
export async function getHome(): Promise<Home> {
  const { data } = await apiClient.get<Home>('/home')
  return data
}
