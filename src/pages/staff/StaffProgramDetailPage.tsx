import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, Check, Pencil, Power, X } from 'lucide-react'
import { useProgramApplicationsQuery, useProgramQuery, useReviewApplicationMutation, useUpdateProgramStatusMutation } from '@/hooks/usePrograms'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { Badge } from '@/components/ui/Badge'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProfileInfoGrid } from '@/components/students/ProfileInfoGrid'
import { ActiveBadge } from '@/components/students/StatusBadge'
import { ApplicationStatusBadge } from '@/components/programs/ApplicationStatusBadge'
import { ProgramForm } from '@/components/forms/ProgramForm'
import { formatDate, formatDateTime } from '@/utils/formatters'
import { getErrorMessage } from '@/utils/errors'
import { ApplicationStatus, EducationLevelLabels, enumLabel } from '@/types'

export default function StaffProgramDetailPage() {
  const { id } = useParams<{ id: string }>()
  const programId = Number(id)

  const [editing, setEditing] = useState(false)
  const [confirmingStatusChange, setConfirmingStatusChange] = useState(false)

  const { data: program, isPending, isError, error, refetch } = useProgramQuery(programId)
  const { data: applications, isPending: applicationsPending } = useProgramApplicationsQuery(programId)
  const statusMutation = useUpdateProgramStatusMutation(programId)
  const reviewMutation = useReviewApplicationMutation(programId)

  if (isPending) return <Spinner label="Loading program" />
  if (isError) return <ErrorState error={error} onRetry={refetch} />
  if (!program) return null

  async function handleToggleStatus() {
    if (!program) return
    try {
      await statusMutation.mutateAsync({ isActive: !program.isActive })
      toast.success(program.isActive ? 'Program deactivated' : 'Program activated')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update this program.'))
    } finally {
      setConfirmingStatusChange(false)
    }
  }

  async function handleReview(applicationId: number, status: typeof ApplicationStatus.Approved | typeof ApplicationStatus.Rejected) {
    try {
      await reviewMutation.mutateAsync({ applicationId, request: { status } })
      toast.success(status === ApplicationStatus.Approved ? 'Application approved' : 'Application rejected')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not review this application.'))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/staff/programs" className="flex w-fit items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="size-4" /> Back to Programs
      </Link>

      <PageHeader
        title={program.name}
        description={`Eligible: ${enumLabel(EducationLevelLabels, program.eligibleEducationLevel)}`}
        action={
          !editing && (
            <div className="flex gap-2">
              <Button onClick={() => setEditing(true)}>
                <Pencil className="size-4" /> Edit
              </Button>
              <Button variant={program.isActive ? 'danger' : 'primary'} onClick={() => setConfirmingStatusChange(true)}>
                <Power className="size-4" /> {program.isActive ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          )
        }
      />

      <Card>
        <CardBody className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <ActiveBadge isActive={program.isActive} />
            <Badge tone="blue">{enumLabel(EducationLevelLabels, program.eligibleEducationLevel)}</Badge>
            <Badge tone={program.isAcceptingApplications ? 'green' : 'gray'}>
              {program.isAcceptingApplications ? 'Accepting Applications' : 'Closed'}
            </Badge>
          </div>
          {program.description && <p className="text-sm text-slate-600">{program.description}</p>}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title={editing ? 'Edit Program' : 'Program Details'} />
        <CardBody>
          {editing ? (
            <ProgramForm program={program} onCancel={() => setEditing(false)} onSuccess={() => setEditing(false)} />
          ) : (
            <ProfileInfoGrid
              items={[
                { label: 'Program Name', value: program.name },
                { label: 'Eligible Education Level', value: enumLabel(EducationLevelLabels, program.eligibleEducationLevel) },
                { label: 'Application Deadline', value: formatDate(program.applicationDeadline) },
                { label: 'Created', value: formatDate(program.createdAt) },
                { label: 'Description', value: program.description },
              ]}
            />
          )}
        </CardBody>
      </Card>

      {!editing && (
        <Card>
          <CardHeader title="Applications" subtitle={applications ? `${applications.length} total` : undefined} />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Admission No.</th>
                  <th className="px-4 py-3 font-medium">Applied</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(applications ?? []).map((application) => (
                  <tr key={application.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{application.studentName}</td>
                    <td className="px-4 py-3 text-slate-600">{application.studentAdmissionNumber}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDateTime(application.appliedAt)}</td>
                    <td className="px-4 py-3">
                      <ApplicationStatusBadge status={application.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      {application.status === ApplicationStatus.Pending ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            loading={reviewMutation.isPending}
                            onClick={() => handleReview(application.id, ApplicationStatus.Approved)}
                          >
                            <Check className="size-4" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            loading={reviewMutation.isPending}
                            onClick={() => handleReview(application.id, ApplicationStatus.Rejected)}
                          >
                            <X className="size-4" /> Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          {application.reviewedByStaffName ? `Reviewed by ${application.reviewedByStaffName}` : 'Reviewed'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!applicationsPending && (applications ?? []).length === 0 && (
              <EmptyState title="No applications yet" description="Students who apply to this program will appear here." />
            )}
          </div>
        </Card>
      )}

      <ConfirmDialog
        open={confirmingStatusChange}
        onClose={() => setConfirmingStatusChange(false)}
        onConfirm={handleToggleStatus}
        title={program.isActive ? 'Deactivate program' : 'Activate program'}
        description={
          program.isActive
            ? `Deactivating "${program.name}" hides it from students and blocks new applications.`
            : `Activating "${program.name}" makes it visible to eligible students again.`
        }
        confirmLabel={program.isActive ? 'Deactivate' : 'Activate'}
        tone={program.isActive ? 'danger' : 'primary'}
        loading={statusMutation.isPending}
      />
    </div>
  )
}
