import { Link } from 'react-router-dom'
import { CalendarCheck2, IdCard, MessageSquare, User } from 'lucide-react'
import { useHomeQuery } from '@/hooks/useHome'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function StudentDashboardPage() {
  const { data: home, isPending, isError, error, refetch } = useHomeQuery()

  if (isError) return <ErrorState error={error} onRetry={refetch} />

  const info = home?.studentInfo

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={isPending ? 'Welcome back' : home!.greeting}
        description={info ? `Grade ${info.grade} - Section ${info.section} · Roll No. ${info.rollNumber}` : undefined}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isPending ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard
              label="Attendance (last 30 days)"
              value={`${info?.attendancePercentage.toFixed(1) ?? '0.0'}%`}
              icon={CalendarCheck2}
              tone="emerald"
            />
            <StatCard label="Upcoming Exams" value={info?.upcomingExamsCount ?? 0} icon={IdCard} tone="amber" />
            <StatCard label="Admission Number" value={info?.admissionNumber ?? '—'} icon={User} tone="brand" />
          </>
        )}
      </div>

      <Card>
        <CardHeader title="Quick Actions" subtitle="Jump to the things you use most" />
        <CardBody>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Link to="/student/profile">
              <Button variant="outline" fullWidth className="justify-start">
                <User className="size-4" /> View Profile
              </Button>
            </Link>
            <Link to="/student/profile?edit=1">
              <Button variant="outline" fullWidth className="justify-start">
                <IdCard className="size-4" /> Edit Profile
              </Button>
            </Link>
            <Link to="/student/messages">
              <Button variant="outline" fullWidth className="justify-start">
                <MessageSquare className="size-4" /> Messages
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
