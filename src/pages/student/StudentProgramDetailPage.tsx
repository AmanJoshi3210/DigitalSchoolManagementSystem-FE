import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, Send } from 'lucide-react'
import { useApplyToProgramMutation, useMyApplicationsQuery, useProgramQuery } from '@/hooks/usePrograms'
import { useMyProfileQuery } from '@/hooks/useProfile'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { Badge } from '@/components/ui/Badge'
import { ProfileInfoGrid } from '@/components/students/ProfileInfoGrid'
import { ApplicationStatusBadge } from '@/components/programs/ApplicationStatusBadge'
import { formatDate } from '@/utils/formatters'
import { getErrorMessage } from '@/utils/errors'
import { EducationLevelLabels, enumLabel } from '@/types'

export default function StudentProgramDetailPage() {
  const { id } = useParams<{ id: string }>()
  const programId = Number(id)

  const { data: program, isPending, isError, error, refetch } = useProgramQuery(programId)
  const { data: profile } = useMyProfileQuery()
  const { data: applications } = useMyApplicationsQuery()
  const applyMutation = useApplyToProgramMutation()

  if (isPending) return <Spinner label="Loading program" />
  if (isError) return <ErrorState error={error} onRetry={refetch} />
  if (!program) return null

  const existingApplication = applications?.find((a) => a.programId === programId)
  const studentEducationLevel = profile?.educationLevel
  const isEligible = studentEducationLevel != null && studentEducationLevel === program.eligibleEducationLevel

  async function handleApply() {
    try {
      await applyMutation.mutateAsync(programId)
      toast.success('Application submitted')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not submit your application.'))
    }
  }

  let disabledReason: string | null = null
  if (studentEducationLevel == null) {
    disabledReason = 'Set your education level in your profile before applying.'
  } else if (!isEligible) {
    disabledReason = 'You are not eligible for this program.'
  } else if (!program.isAcceptingApplications) {
    disabledReason = program.isActive ? 'The application deadline for this program has passed.' : 'This program is not currently active.'
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/student/programs" className="flex w-fit items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="size-4" /> Back to Programs
      </Link>

      <PageHeader title={program.name} description={`Eligible: ${enumLabel(EducationLevelLabels, program.eligibleEducationLevel)}`} />

      <Card>
        <CardBody className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge tone="blue">{enumLabel(EducationLevelLabels, program.eligibleEducationLevel)}</Badge>
            <Badge tone={program.isAcceptingApplications ? 'green' : 'gray'}>
              {program.isAcceptingApplications ? 'Accepting Applications' : 'Closed'}
            </Badge>
          </div>
          {program.description && <p className="text-sm text-slate-600">{program.description}</p>}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Program Details" />
        <CardBody>
          <ProfileInfoGrid
            items={[
              { label: 'Eligible Education Level', value: enumLabel(EducationLevelLabels, program.eligibleEducationLevel) },
              { label: 'Application Deadline', value: formatDate(program.applicationDeadline) },
            ]}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Your Application" />
        <CardBody className="flex flex-col gap-3">
          {existingApplication ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Status:</span>
              <ApplicationStatusBadge status={existingApplication.status} />
            </div>
          ) : (
            <>
              {disabledReason && <p className="text-sm text-amber-700">{disabledReason}</p>}
              <div>
                <Button onClick={handleApply} disabled={Boolean(disabledReason)} loading={applyMutation.isPending}>
                  <Send className="size-4" /> Apply Now
                </Button>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
