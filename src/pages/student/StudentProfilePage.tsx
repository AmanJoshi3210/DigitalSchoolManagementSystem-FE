import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Camera, Loader2, Pencil } from 'lucide-react'
import { useMyProfileQuery, useMyAcademicsQuery, useMyEducationStatusQuery, useUpdateMyProfileImageMutation } from '@/hooks/useProfile'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { ProfileInfoGrid } from '@/components/students/ProfileInfoGrid'
import { EnrollmentStatusBadge } from '@/components/students/StatusBadge'
import { EditOwnProfileForm } from '@/components/forms/EditOwnProfileForm'
import { formatDate, fullName } from '@/utils/formatters'
import { getErrorMessage } from '@/utils/errors'
import { EducationLevelLabels, GenderLabels, enumLabel } from '@/types'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024 // matches FileStorage:MaxFileSizeBytes on the backend

export default function StudentProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [editing, setEditing] = useState(searchParams.get('edit') === '1')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: student, isPending, isError, error, refetch } = useMyProfileQuery()
  const { data: educationStatus } = useMyEducationStatusQuery()
  const { data: academics } = useMyAcademicsQuery()
  const uploadImageMutation = useUpdateMyProfileImageMutation()

  function handlePhotoButtonClick() {
    fileInputRef.current?.click()
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file later
    if (!file) return

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Please choose a JPEG, PNG, WEBP or GIF image.')
      return
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error('Image must be 10MB or smaller.')
      return
    }

    try {
      await uploadImageMutation.mutateAsync(file)
      toast.success('Profile photo updated')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not upload your profile photo.'))
    }
  }

  function stopEditing() {
    setEditing(false)
    searchParams.delete('edit')
    setSearchParams(searchParams, { replace: true })
  }

  if (isPending) return <Spinner label="Loading your profile" />
  if (isError) return <ErrorState error={error} onRetry={refetch} />
  if (!student) return null

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Profile"
        description="View and manage your personal information"
        action={
          !editing && (
            <Button onClick={() => setEditing(true)}>
              <Pencil className="size-4" /> Edit Profile
            </Button>
          )
        }
      />

      <Card>
        <CardBody className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="relative shrink-0">
            <Avatar firstName={student.firstName} lastName={student.lastName} imageUrl={student.profileImageUrl} size="lg" />
            <button
              type="button"
              onClick={handlePhotoButtonClick}
              disabled={uploadImageMutation.isPending}
              aria-label="Change profile photo"
              title="Change profile photo"
              className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border border-white bg-brand-600 text-white shadow-sm transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
            >
              {uploadImageMutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" aria-hidden />
              ) : (
                <Camera className="size-3.5" aria-hidden />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_IMAGE_TYPES.join(',')}
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
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
        <CardHeader title={editing ? 'Edit Profile' : 'Personal Information'} />
        <CardBody>
          {editing ? (
            <EditOwnProfileForm student={student} onCancel={stopEditing} onSuccess={stopEditing} />
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
          <CardHeader title="Academic Information" subtitle="Managed by staff - contact them to make changes" />
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
    </div>
  )
}
