import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { portalHomePath } from '@/utils/portal'

/** Keeps an already-authenticated user off /login and /register - they're bounced straight to their dashboard. */
export function GuestRoute() {
  const { session } = useAuth()

  if (session) {
    return <Navigate to={portalHomePath(session.portal)} replace />
  }

  return <Outlet />
}
