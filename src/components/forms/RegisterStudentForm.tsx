import { useState, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { FormSection } from './FormSection'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { fieldError, getErrorMessage, isApiError } from '@/utils/errors'
import { GenderLabels } from '@/types'
import type { RegisterStudentRequest } from '@/types'

const initialState: RegisterStudentRequest = {
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  address: '',
  dateOfBirth: '',
  gender: undefined,
  admissionNumber: '',
  rollNumber: '',
  grade: '',
  section: '',
  admissionDate: '',
  guardianName: '',
  guardianPhoneNumber: '',
  bloodGroup: '',
}

export function RegisterStudentForm() {
  const { registerStudent } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<RegisterStudentRequest>(initialState)
  const [error, setError] = useState<unknown>(null)
  const [submitting, setSubmitting] = useState(false)

  function update<K extends keyof RegisterStudentRequest>(key: K, value: RegisterStudentRequest[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await registerStudent({
        ...form,
        phoneNumber: form.phoneNumber || null,
        address: form.address || null,
        dateOfBirth: form.dateOfBirth || null,
        guardianName: form.guardianName || null,
        guardianPhoneNumber: form.guardianPhoneNumber || null,
        bloodGroup: form.bloodGroup || null,
      })
      toast.success('Account created! Welcome to Digital School Management System.')
      navigate('/student/dashboard', { replace: true })
    } catch (err) {
      setError(err)
      toast.error(getErrorMessage(err, 'Registration failed.'))
    } finally {
      setSubmitting(false)
    }
  }

  const generalError = error && (!isApiError(error) || !error.fieldErrors) ? getErrorMessage(error) : ''

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      {generalError && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {generalError}
        </div>
      )}

      <FormSection title="Account">
        <Input
          label="Username"
          required
          maxLength={100}
          value={form.username}
          onChange={(e) => update('username', e.target.value)}
          error={fieldError(error, 'username')}
        />
        <Input
          label="Email"
          type="email"
          required
          maxLength={150}
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          error={fieldError(error, 'email')}
        />
        <div className="sm:col-span-2">
          <PasswordInput
            label="Password"
            required
            minLength={8}
            hint="At least 8 characters"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            error={fieldError(error, 'password')}
            autoComplete="new-password"
          />
        </div>
      </FormSection>

      <FormSection title="Personal Details">
        <Input
          label="First Name"
          required
          maxLength={100}
          value={form.firstName}
          onChange={(e) => update('firstName', e.target.value)}
          error={fieldError(error, 'firstName')}
        />
        <Input
          label="Last Name"
          required
          maxLength={100}
          value={form.lastName}
          onChange={(e) => update('lastName', e.target.value)}
          error={fieldError(error, 'lastName')}
        />
        <Input
          label="Phone Number"
          maxLength={20}
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
      </FormSection>

      <FormSection title="Academic Details">
        <Input
          label="Admission Number"
          required
          maxLength={50}
          value={form.admissionNumber}
          onChange={(e) => update('admissionNumber', e.target.value)}
          error={fieldError(error, 'admissionNumber')}
        />
        <Input
          label="Roll Number"
          required
          maxLength={50}
          value={form.rollNumber}
          onChange={(e) => update('rollNumber', e.target.value)}
          error={fieldError(error, 'rollNumber')}
        />
        <Input
          label="Grade"
          required
          maxLength={50}
          placeholder="e.g. 10"
          value={form.grade}
          onChange={(e) => update('grade', e.target.value)}
          error={fieldError(error, 'grade')}
        />
        <Input
          label="Section"
          required
          maxLength={20}
          placeholder="e.g. A"
          value={form.section}
          onChange={(e) => update('section', e.target.value)}
          error={fieldError(error, 'section')}
        />
        <Input
          label="Admission Date"
          type="date"
          required
          value={form.admissionDate}
          onChange={(e) => update('admissionDate', e.target.value)}
          error={fieldError(error, 'admissionDate')}
        />
        <Input
          label="Blood Group"
          placeholder="e.g. O+"
          value={form.bloodGroup ?? ''}
          onChange={(e) => update('bloodGroup', e.target.value)}
          error={fieldError(error, 'bloodGroup')}
        />
        <Input
          label="Guardian Name"
          value={form.guardianName ?? ''}
          onChange={(e) => update('guardianName', e.target.value)}
          error={fieldError(error, 'guardianName')}
        />
        <Input
          label="Guardian Phone Number"
          value={form.guardianPhoneNumber ?? ''}
          onChange={(e) => update('guardianPhoneNumber', e.target.value)}
          error={fieldError(error, 'guardianPhoneNumber')}
        />
      </FormSection>

      <Button type="submit" fullWidth loading={submitting}>
        Create Student Account
      </Button>
    </form>
  )
}
