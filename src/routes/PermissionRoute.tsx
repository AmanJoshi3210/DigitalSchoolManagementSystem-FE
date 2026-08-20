import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

/**
 * Blocks access to a staff page the current user hasn't been granted. Mirrors RoleRoute's
 * shape/behavior - a UX guard only, every underlying endpoint re-checks via
 * RequireStaffPermissionAttribute server-side regardless.
 */
export function PermissionRoute({ permission }: { permission: string }) {
  const { hasPermission } = useAuth()

  if (!hasPermission(permission)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
