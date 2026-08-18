import { useState, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useUpdateMyProfileMutation } from '@/hooks/useProfile'
import { fieldError, getErrorMessage, isApiError } from '@/utils/errors'
import { toDateInputValue } from '@/utils/formatters'
import { EducationLevelLabels, GenderLabels } from '@/types'
import type { Student, UpdateOwnProfileRequest } from '@/types'

export function EditOwnProfileForm({ student, onCancel, onSuccess }: { student: Student; onCancel: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState<UpdateOwnProfileRequest>({
    firstName: student.firstName,
    lastName: student.lastName,
    phoneNumber: student.phoneNumber ?? '',
    address: student.address ?? '',
    dateOfBirth: toDateInputValue(student.dateOfBirth),
    gender: student.gender ?? undefined,
    profileImageUrl: student.profileImageUrl ?? '',
    educationLevel: student.educationLevel ?? undefined,
  })
  const [error, setError] = useState<unknown>(null)
  const mutation = useUpdateMyProfileMutation()

  function update<K extends keyof UpdateOwnProfileRequest>(key: K, value: UpdateOwnProfileRequest[K]) {
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
      })
      toast.success('Profile updated')
      onSuccess()
    } catch (err) {
      setError(err)
      toast.error(getErrorMessage(err, 'Could not update your profile.'))
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
        <Input
          label="First Name"
          required
          value={form.firstName}
          onChange={(e) => update('firstName', e.target.value)}
          error={fieldError(error, 'firstName')}
        />
        <Input
          label="Last Name"
          required
          value={form.lastName}
          onChange={(e) => update('lastName', e.target.value)}
          error={fieldError(error, 'lastName')}
        />
        <Input
          label="Phone Number"
          value={form.phoneNumber ?? ''}
          onChange={(e) => update('phoneNumber', e.target.value)}
          error={fieldError(error, 'phoneNumber')}
        />
        <Input
          label="Date of Birth"
          type="date"
          value={form.dateOfBirth ?? ''}
          onChange={(e) => update('dateOfBirth', e.target.value)}
          error={fieldError(error, 'dateOfBirth')}
        />
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
        <Input
          label="Address"
          value={form.address ?? ''}
          onChange={(e) => update('address', e.target.value)}
          error={fieldError(error, 'address')}
        />
        <Select
          label="Education Level"
          hint="Used to determine which education programs you're eligible for"
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
            hint="Paste a link to an image - there's no file upload endpoint on the backend yet"
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
