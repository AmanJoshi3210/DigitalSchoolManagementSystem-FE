import { ClipboardCheck, GraduationCap, LayoutDashboard, MessageSquare, ShieldCheck, Users } from 'lucide-react'
import { PortalLayout, type NavItem } from './PortalLayout'
import { usePendingApplicationsQuery } from '@/hooks/usePrograms'
import { usePendingDocumentsQuery } from '@/hooks/useDocuments'
import { useAuth } from '@/hooks/useAuth'
import { StaffPermissionKey } from '@/types'

export function StaffLayout() {
  const { hasPermission, isAdmin } = useAuth()
  const canSeeActionHub = hasPermission(StaffPermissionKey.ActionHub)

  // Shares its query cache with ActionHubPage's own queries, so this costs nothing extra
  // once that page has been visited (and is cheap even before, given how few items these are).
  // Gated on the same permission that guards the underlying endpoints server-side, so a staff
  // user without ActionHub access never fires these (they'd just 403).
  const { data: pendingApplications } = usePendingApplicationsQuery(canSeeActionHub)
  const { data: pendingDocuments } = usePendingDocumentsQuery(canSeeActionHub)
  const pendingCount = (pendingApplications?.length ?? 0) + (pendingDocuments?.length ?? 0)

  const allNavItems: (NavItem & { permissionKey?: string })[] = [
    { label: 'Dashboard', to: '/staff/dashboard', icon: LayoutDashboard },
    {
      label: 'Action Hub',
      to: '/staff/action-hub',
      icon: ClipboardCheck,
      badgeCount: pendingCount,
      permissionKey: StaffPermissionKey.ActionHub,
    },
    { label: 'Students', to: '/staff/students', icon: Users, permissionKey: StaffPermissionKey.Students },
    { label: 'Programs', to: '/staff/programs', icon: GraduationCap, permissionKey: StaffPermissionKey.Programs },
    {
      label: 'Messages',
      to: '/staff/messages',
      icon: MessageSquare,
      showUnreadBadge: true,
      permissionKey: StaffPermissionKey.Messages,
    },
  ]

  const navItems = allNavItems.filter((item) => !item.permissionKey || hasPermission(item.permissionKey))

  // Admin-only, gated directly by StaffRole rather than through the permissionKey filter above -
  // this screen must never be reachable via the grantable-permission system.
  if (isAdmin) {
    navItems.push({ label: 'Staff Permissions', to: '/staff/permissions', icon: ShieldCheck })
  }

  return <PortalLayout portal="staff" portalLabel="Staff / Admin Portal" navItems={navItems} />
}
