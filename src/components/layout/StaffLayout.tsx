import { ClipboardCheck, GraduationCap, LayoutDashboard, MessageSquare, Users } from 'lucide-react'
import { PortalLayout, type NavItem } from './PortalLayout'
import { usePendingApplicationsQuery } from '@/hooks/usePrograms'
import { usePendingDocumentsQuery } from '@/hooks/useDocuments'

export function StaffLayout() {
  // Shares its query cache with ActionHubPage's own queries, so this costs nothing extra
  // once that page has been visited (and is cheap even before, given how few items these are).
  const { data: pendingApplications } = usePendingApplicationsQuery()
  const { data: pendingDocuments } = usePendingDocumentsQuery()
  const pendingCount = (pendingApplications?.length ?? 0) + (pendingDocuments?.length ?? 0)

  const navItems: NavItem[] = [
    { label: 'Dashboard', to: '/staff/dashboard', icon: LayoutDashboard },
    { label: 'Action Hub', to: '/staff/action-hub', icon: ClipboardCheck, badgeCount: pendingCount },
    { label: 'Students', to: '/staff/students', icon: Users },
    { label: 'Programs', to: '/staff/programs', icon: GraduationCap },
    { label: 'Messages', to: '/staff/messages', icon: MessageSquare, showUnreadBadge: true },
  ]

  return <PortalLayout portal="staff" portalLabel="Staff / Admin Portal" navItems={navItems} />
}
