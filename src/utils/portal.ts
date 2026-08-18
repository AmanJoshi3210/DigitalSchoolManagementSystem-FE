import type { Portal } from '@/types'

export function portalHomePath(portal: Portal): string {
  return portal === 'student' ? '/student/dashboard' : '/staff/dashboard'
}
