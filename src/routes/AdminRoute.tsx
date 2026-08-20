import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

/**
 * Blocks access to the staff-management (permissions) screen unless the session's StaffRole is
 * Admin. Deliberately a separate component from PermissionRoute: this screen must only ever be
 * reachable via StaffRole, never via a grantable permission, or a non-admin could be granted the
 * ability to grant themselves admin. Server-side, StaffManagementController enforces the same
 * rule via RequireStaffRoleAttribute.
 */
export function AdminRoute() {
  const { isAdmin } = useAuth()

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
