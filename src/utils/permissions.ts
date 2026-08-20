import { StaffRole } from '@/types/enums'
import type { StoredSession } from '@/types/auth'

// StaffRole.Admin always implicitly has every permission and never gets StaffPermission rows
// server-side - this is the frontend half of that bypass (backend half is
// RequireStaffPermissionAttribute). session.permissions itself always stays a literal list of
// granted keys, mirroring what the JWT/AuthResponseDto carry.
export function isStaffAdmin(session: StoredSession | null): boolean {
  return session?.portal === 'staff' && session.staffRole === StaffRole.Admin
}

export function hasStaffPermission(session: StoredSession | null, key: string): boolean {
  if (session?.portal !== 'staff') return false
  if (isStaffAdmin(session)) return true
  return session.permissions?.includes(key) ?? false
}
