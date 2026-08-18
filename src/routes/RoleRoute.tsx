import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import type { Portal } from '@/types'

/**
 * Blocks cross-portal access: a Student session hitting a /staff/* URL (or vice versa) is
 * bounced to /unauthorized rather than being shown the other portal's layout/data. This is a
 * UX guard only - every underlying endpoint re-checks the role/claims server-side regardless.
 */
export function RoleRoute({ portal }: { portal: Portal }) {
  const { session } = useAuth()

  if (session?.portal !== portal) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
