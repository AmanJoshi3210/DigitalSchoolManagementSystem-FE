import { useState, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useUpdateStudentMutation } from '@/hooks/useStudents'
import { fieldError, getErrorMessage, isApiError } from '@/utils/errors'
import { toDateInputValue } from '@/utils/formatters'
import { EducationLevelLabels, GenderLabels } from '@/types'
import type { Student, UpdateStudentRequest } from '@/types'

export function EditStudentForm({ student, onCancel, onSuccess }: { student: Student; onCancel: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState<UpdateStudentRequest>({
    firstName: student.firstName,
    lastName: student.lastName,
    phoneNumber: student.phoneNumber ?? '',
    address: student.address ?? '',
    dateOfBirth: toDateInputValue(student.dateOfBirth),
    gender: student.gender ?? undefined,
    profileImageUrl: student.profileImageUrl ?? '',
    grade: student.grade,
    section: student.section,
    rollNumber: student.rollNumber,
    guardianName: student.guardianName ?? '',
    guardianPhoneNumber: student.guardianPhoneNumber ?? '',
    bloodGroup: student.bloodGroup ?? '',
    educationLevel: student.educationLevel ?? undefined,
  })
  const [error, setError] = useState<unknown>(null)
  const mutation = useUpdateStudentMutation(student.id)

  function update<K extends keyof UpdateStudentRequest>(key: K, value: UpdateStudentRequest[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await mutation.mutateAsync({
        ...form,
        phoneNumber: form.phoneNumber || null,
        address: form.address || null,
        dateOfBirth: form.dateOfBirth || null,
        profileImageUrl: form.profileImageUrl || null,
        guardianName: form.guardianName || null,
        guardianPhoneNumber: form.guardianPhoneNumber || null,
        bloodGroup: form.bloodGroup || null,
      })
      toast.success('Student profile updated')
      onSuccess()
    } catch (err) {
      setError(err)
      toast.error(getErrorMessage(err, 'Could not update this student.'))
    }
  }

  const generalError = error && (!isApiError(error) || !error.fieldErrors) ? getErrorMessage(error) : ''

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {generalError && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {generalError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="First Name" required value={form.firstName} onChange={(e) => update('firstName', e.target.value)} error={fieldError(error, 'firstName')} />
        <Input label="Last Name" required value={form.lastName} onChange={(e) => update('lastName', e.target.value)} error={fieldError(error, 'lastName')} />
        <Input label="Phone Number" value={form.phoneNumber ?? ''} onChange={(e) => update('phoneNumber', e.target.value)} error={fieldError(error, 'phoneNumber')} />
        <Input label="Date of Birth" type="date" value={form.dateOfBirth ?? ''} onChange={(e) => update('dateOfBirth', e.target.value)} error={fieldError(error, 'dateOfBirth')} />
        <Select
          label="Gender"
          value={form.gender ?? ''}
          onChange={(e) => update('gender', e.target.value === '' ? undefined : (Number(e.target.value) as typeof form.gender))}
        >
          <option value="">Prefer not to say</option>
          {Object.entries(GenderLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <Input label="Address" value={form.address ?? ''} onChange={(e) => update('address', e.target.value)} error={fieldError(error, 'address')} />

        <Input label="Grade" required value={form.grade} onChange={(e) => update('grade', e.target.value)} error={fieldError(error, 'grade')} />
        <Input label="Section" required value={form.section} onChange={(e) => update('section', e.target.value)} error={fieldError(error, 'section')} />
        <Input label="Roll Number" required value={form.rollNumber} onChange={(e) => update('rollNumber', e.target.value)} error={fieldError(error, 'rollNumber')} />
        <Input label="Blood Group" value={form.bloodGroup ?? ''} onChange={(e) => update('bloodGroup', e.target.value)} error={fieldError(error, 'bloodGroup')} />
        <Input label="Guardian Name" value={form.guardianName ?? ''} onChange={(e) => update('guardianName', e.target.value)} error={fieldError(error, 'guardianName')} />
        <Input label="Guardian Phone" value={form.guardianPhoneNumber ?? ''} onChange={(e) => update('guardianPhoneNumber', e.target.value)} error={fieldError(error, 'guardianPhoneNumber')} />
        <Select
          label="Education Level"
          value={form.educationLevel ?? ''}
          onChange={(e) => update('educationLevel', e.target.value === '' ? undefined : (Number(e.target.value) as typeof form.educationLevel))}
        >
          <option value="">Not set</option>
          {Object.entries(EducationLevelLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>

        <div className="sm:col-span-2">
          <Input
            label="Profile Image URL"
            placeholder="https://…"
            value={form.profileImageUrl ?? ''}
            onChange={(e) => update('profileImageUrl', e.target.value)}
            error={fieldError(error, 'profileImageUrl')}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button type="submit" loading={mutation.isPending}>
          Save Changes
        </Button>
      </div>
    </form>
  )
}
