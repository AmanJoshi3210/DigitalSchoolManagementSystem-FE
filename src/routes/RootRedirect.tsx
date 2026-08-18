import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { portalHomePath } from '@/utils/portal'

export function RootRedirect() {
  const { session } = useAuth()
  return <Navigate to={session ? portalHomePath(session.portal) : '/login'} replace />
}
