import { FileText, GraduationCap, LayoutDashboard, MessageSquare, User } from 'lucide-react'
import { PortalLayout, type NavItem } from './PortalLayout'

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/student/dashboard', icon: LayoutDashboard },
  { label: 'My Profile', to: '/student/profile', icon: User },
  { label: 'Documents', to: '/student/documents', icon: FileText },
  { label: 'Programs', to: '/student/programs', icon: GraduationCap },
  { label: 'Messages', to: '/student/messages', icon: MessageSquare, showUnreadBadge: true },
]

export function StudentLayout() {
  return <PortalLayout portal="student" portalLabel="Student Portal" navItems={navItems} />
}
