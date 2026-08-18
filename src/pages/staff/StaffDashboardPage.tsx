import { Link } from 'react-router-dom'
import { Bell, ClipboardCheck, MessageSquare, Users, UserCheck } from 'lucide-react'
import { useHomeQuery } from '@/hooks/useHome'
import { useStudentsQuery } from '@/hooks/useStudents'
import { useUnreadCountQuery } from '@/hooks/useNotifications'
import { usePendingApplicationsQuery } from '@/hooks/usePrograms'
import { usePendingDocumentsQuery } from '@/hooks/useDocuments'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProfileInfoGrid } from '@/components/students/ProfileInfoGrid'
import { StaffRoleLabels, enumLabel } from '@/types'

export default function StaffDashboardPage() {
  const { data: home, isPending, isError, error, refetch } = useHomeQuery()
  const { data: students } = useStudentsQuery()
  const { data: unreadCount } = useUnreadCountQuery()
  const { data: pendingApplications } = usePendingApplicationsQuery()
  const { data: pendingDocuments } = usePendingDocumentsQuery()

  if (isError) return <ErrorState error={error} onRetry={refetch} />

  const info = home?.staffInfo
  const pendingCount = (pendingApplications?.length ?? 0) + (pendingDocuments?.length ?? 0)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={isPending ? 'Welcome back' : home!.greeting}
        description={info ? `${enumLabel(StaffRoleLabels, info.role)}${info.department ? ` · ${info.department}` : ''}` : undefined}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isPending ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard label="Total Students" value={students?.length ?? '—'} icon={Users} tone="brand" />
            <StatCard label="Active Students" value={info?.totalActiveStudents ?? '—'} icon={UserCheck} tone="emerald" />
            <StatCard label="Pending Actions" value={pendingCount} icon={ClipboardCheck} tone="purple" />
            <StatCard label="Unread Messages" value={unreadCount ?? 0} icon={Bell} tone="rose" />
          </>
        )}
      </div>

      <Card>
        <CardHeader title="Quick Actions" />
        <CardBody>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link to="/staff/action-hub">
              <Button variant="outline" fullWidth className="justify-start">
                <ClipboardCheck className="size-4" /> Go to Action Hub
              </Button>
            </Link>
            <Link to="/staff/students">
              <Button variant="outline" fullWidth className="justify-start">
                <Users className="size-4" /> View All Students
              </Button>
            </Link>
            <Link to="/staff/messages">
              <Button variant="outline" fullWidth className="justify-start">
                <MessageSquare className="size-4" /> Go to Messages
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>

      {info && (
        <Card>
          <CardHeader title="Your Employment Details" />
          <CardBody>
            <ProfileInfoGrid
              items={[
                { label: 'Employee Code', value: info.employeeCode },
                { label: 'Role', value: enumLabel(StaffRoleLabels, info.role) },
                { label: 'Department', value: info.department },
              ]}
            />
          </CardBody>
        </Card>
      )}
    </div>
  )
}
