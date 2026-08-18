import { Link } from 'react-router-dom'
import { ChevronRight, GraduationCap } from 'lucide-react'
import { useMyApplicationsQuery, useProgramsQuery } from '@/hooks/usePrograms'
import { useMyProfileQuery } from '@/hooks/useProfile'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonRow } from '@/components/ui/Skeleton'
import { ApplicationStatusBadge } from '@/components/programs/ApplicationStatusBadge'
import { formatDate, formatDateTime } from '@/utils/formatters'
import { EducationLevelLabels, enumLabel } from '@/types'
import type { Program } from '@/types'

export default function StudentProgramsPage() {
  const { data: profile } = useMyProfileQuery()
  const { data: programs, isPending, isError, error, refetch } = useProgramsQuery()
  const { data: applications, isPending: applicationsPending } = useMyApplicationsQuery()

  if (isError) return <ErrorState error={error} onRetry={refetch} />

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Programs" description="Browse education programs and check your eligibility" />

      <Card className="overflow-hidden">
        <CardHeader title="Available Programs" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Program</th>
                <th className="px-4 py-3 font-medium">Eligible Level</th>
                <th className="px-4 py-3 font-medium">Deadline</th>
                <th className="px-4 py-3 font-medium">Eligibility</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isPending && Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} columns={5} />)}

              {!isPending &&
                (programs ?? []).map((program) => (
                  <ProgramRow key={program.id} program={program} studentEducationLevel={profile?.educationLevel} />
                ))}
            </tbody>
          </table>

          {!isPending && (programs ?? []).length === 0 && (
            <EmptyState icon={GraduationCap} title="No programs available" description="Check back later for new programs." />
          )}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader title="My Applications" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Program</th>
                <th className="px-4 py-3 font-medium">Applied</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applicationsPending && Array.from({ length: 2 }).map((_, i) => <SkeletonRow key={i} columns={3} />)}

              {!applicationsPending &&
                (applications ?? []).map((application) => (
                  <tr key={application.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link to={`/student/programs/${application.programId}`} className="font-medium text-slate-900 hover:text-brand-600">
                        {application.programName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatDateTime(application.appliedAt)}</td>
                    <td className="px-4 py-3">
                      <ApplicationStatusBadge status={application.status} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {!applicationsPending && (applications ?? []).length === 0 && (
            <EmptyState title="No applications yet" description="Apply to a program above to see it here." />
          )}
        </div>
      </Card>
    </div>
  )
}

function ProgramRow({ program, studentEducationLevel }: { program: Program; studentEducationLevel?: number | null }) {
  const isEligible = studentEducationLevel != null && studentEducationLevel === program.eligibleEducationLevel

  return (
    <tr className="hover:bg-slate-50">
      <td className="px-4 py-3">
        <Link to={`/student/programs/${program.id}`} className="font-medium text-slate-900 hover:text-brand-600">
          {program.name}
        </Link>
      </td>
      <td className="px-4 py-3 text-slate-600">{enumLabel(EducationLevelLabels, program.eligibleEducationLevel)}</td>
      <td className="px-4 py-3 text-slate-600">{formatDate(program.applicationDeadline)}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1.5">
          {studentEducationLevel == null ? (
            <Badge tone="amber">Set education level</Badge>
          ) : (
            <Badge tone={isEligible ? 'green' : 'gray'}>{isEligible ? 'Eligible' : 'Not Eligible'}</Badge>
          )}
          {!program.isAcceptingApplications && <Badge tone="red">Closed</Badge>}
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <Link to={`/student/programs/${program.id}`} className="inline-flex items-center text-brand-600 hover:text-brand-700">
          <ChevronRight className="size-4" />
        </Link>
      </td>
    </tr>
  )
}
