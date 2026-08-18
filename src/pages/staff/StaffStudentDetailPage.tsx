import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, MessageSquare, Pencil, Trash2 } from 'lucide-react'
import { useStudentQuery, useStudentAcademicsQuery, useStudentEducationStatusQuery, useDeleteStudentMutation } from '@/hooks/useStudents'
import { useUserDocumentsQuery } from '@/hooks/useDocuments'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ProfileInfoGrid } from '@/components/students/ProfileInfoGrid'
import { EnrollmentStatusBadge } from '@/components/students/StatusBadge'
import { DocumentList } from '@/components/documents/DocumentList'
import { EditStudentForm } from '@/components/forms/EditStudentForm'
import { formatDate, fullName } from '@/utils/formatters'
import { getErrorMessage } from '@/utils/errors'
import { EducationLevelLabels, GenderLabels, enumLabel } from '@/types'

export default function StaffStudentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const studentId = Number(id)
  const navigate = useNavigate()

  const [editing, setEditing] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const { data: student, isPending, isError, error, refetch } = useStudentQuery(studentId)
  const { data: educationStatus } = useStudentEducationStatusQuery(studentId)
  const { data: academics } = useStudentAcademicsQuery(studentId)
  const { data: documents, isPending: documentsPending } = useUserDocumentsQuery(student?.userId ?? 0)
  const deleteMutation = useDeleteStudentMutation()

  if (isPending) return <Spinner label="Loading student" />
  if (isError) return <ErrorState error={error} onRetry={refetch} />
  if (!student) return null

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(studentId)
      toast.success('Student removed')
      navigate('/staff/students', { replace: true })
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not remove this student.'))
    } finally {
      setConfirmingDelete(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/staff/students" className="flex w-fit items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="size-4" /> Back to Students
      </Link>

      <PageHeader
        title={fullName(student.firstName, student.lastName)}
        description={`Student ID: ${student.admissionNumber}`}
        action={
          !editing && (
            <div className="flex gap-2">
              <Link to={`/staff/messages?to=${student.userId}`}>
                <Button variant="outline">
                  <MessageSquare className="size-4" /> Message
                </Button>
              </Link>
              <Button onClick={() => setEditing(true)}>
                <Pencil className="size-4" /> Edit
              </Button>
              <Button variant="danger" onClick={() => setConfirmingDelete(true)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          )
        }
      />

      <Card>
        <CardBody className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Avatar firstName={student.firstName} lastName={student.lastName} imageUrl={student.profileImageUrl} size="lg" />
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{fullName(student.firstName, student.lastName)}</h2>
            <p className="text-sm text-slate-500">{student.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge tone="blue">
                Grade {student.grade} - {student.section}
              </Badge>
              {educationStatus && <EnrollmentStatusBadge status={educationStatus.status} />}
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title={editing ? 'Edit Student' : 'Personal Information'} />
        <CardBody>
          {editing ? (
            <EditStudentForm student={student} onCancel={() => setEditing(false)} onSuccess={() => setEditing(false)} />
          ) : (
            <ProfileInfoGrid
              items={[
                { label: 'First Name', value: student.firstName },
                { label: 'Last Name', value: student.lastName },
                { label: 'Email', value: student.email },
                { label: 'Username', value: student.username },
                { label: 'Phone Number', value: student.phoneNumber },
                { label: 'Date of Birth', value: formatDate(student.dateOfBirth) },
                { label: 'Gender', value: student.gender != null ? enumLabel(GenderLabels, student.gender) : null },
                { label: 'Address', value: student.address },
              ]}
            />
          )}
        </CardBody>
      </Card>

      {!editing && (
        <Card>
          <CardHeader title="Academic Information" />
          <CardBody>
            <ProfileInfoGrid
              items={[
                { label: 'Admission Number', value: student.admissionNumber },
                { label: 'Roll Number', value: student.rollNumber },
                { label: 'Grade', value: student.grade },
                { label: 'Section', value: student.section },
                { label: 'Admission Date', value: formatDate(student.admissionDate) },
                { label: 'Blood Group', value: student.bloodGroup },
                { label: 'Guardian Name', value: student.guardianName },
                { label: 'Guardian Phone', value: student.guardianPhoneNumber },
                { label: 'Education Level', value: student.educationLevel != null ? enumLabel(EducationLevelLabels, student.educationLevel) : null },
              ]}
            />
          </CardBody>
        </Card>
      )}

      {!editing && academics && (
        <Card>
          <CardHeader title="Academics Summary" subtitle={`Attendance: ${academics.attendancePercentage.toFixed(1)}%`} />
          <CardBody className="flex flex-col gap-4">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">Subjects</p>
              {academics.subjects.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {academics.subjects.map((s) => (
                    <Badge key={s.id} tone="purple">
                      {s.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No subjects assigned yet.</p>
              )}
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">Recent Results</p>
              {academics.recentResults.length > 0 ? (
                <ul className="divide-y divide-slate-100">
                  {academics.recentResults.map((r) => (
                    <li key={r.id} className="flex items-center justify-between py-2 text-sm">
                      <span className="text-slate-700">
                        {r.examName} · {r.subjectName}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">
                          {r.marksObtained}/{r.maxMarks}
                        </span>
                        <Badge tone={r.passed ? 'green' : 'red'}>{r.passed ? 'Passed' : 'Failed'}</Badge>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">No exam results recorded yet.</p>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {!editing && (
        <Card className="overflow-hidden">
          <CardHeader title="Documents" subtitle="Documents this student has uploaded" />
          <DocumentList
            documents={documents}
            isPending={documentsPending}
            emptyTitle="No documents uploaded"
            emptyDescription="This student hasn't uploaded any documents yet."
          />
        </Card>
      )}

      <ConfirmDialog
        open={confirmingDelete}
        onClose={() => setConfirmingDelete(false)}
        onConfirm={handleDelete}
        title="Remove student"
        description={`Are you sure you want to remove ${fullName(student.firstName, student.lastName)}? This cannot be undone.`}
        confirmLabel="Remove"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
