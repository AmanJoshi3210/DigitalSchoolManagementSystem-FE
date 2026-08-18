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
import { GenderLabels, StaffRole, StaffRoleLabels } from '@/types'
import type { RegisterStaffRequest } from '@/types'

const initialState: RegisterStaffRequest = {
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  address: '',
  dateOfBirth: '',
  gender: undefined,
  employeeCode: '',
  role: StaffRole.Staff,
  department: '',
  joiningDate: '',
  qualification: '',
  salary: undefined,
}

export function RegisterStaffForm() {
  const { registerStaff } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<RegisterStaffRequest>(initialState)
  const [error, setError] = useState<unknown>(null)
  const [submitting, setSubmitting] = useState(false)

  function update<K extends keyof RegisterStaffRequest>(key: K, value: RegisterStaffRequest[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await registerStaff({
        ...form,
        phoneNumber: form.phoneNumber || null,
        address: form.address || null,
        dateOfBirth: form.dateOfBirth || null,
        department: form.department || null,
        qualification: form.qualification || null,
        salary: form.salary ?? null,
      })
      toast.success('Account created! Welcome to Digital School Management System.')
      navigate('/staff/dashboard', { replace: true })
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

      <FormSection title="Employment Details">
        <Input
          label="Employee Code"
          required
          maxLength={50}
          value={form.employeeCode}
          onChange={(e) => update('employeeCode', e.target.value)}
          error={fieldError(error, 'employeeCode')}
        />
        <Select
          label="Role"
          required
          value={form.role}
          onChange={(e) => update('role', Number(e.target.value) as typeof form.role)}
          error={fieldError(error, 'role')}
        >
          {Object.entries(StaffRoleLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <Input
          label="Department"
          maxLength={100}
          value={form.department ?? ''}
          onChange={(e) => update('department', e.target.value)}
          error={fieldError(error, 'department')}
        />
        <Input
          label="Joining Date"
          type="date"
          required
          value={form.joiningDate}
          onChange={(e) => update('joiningDate', e.target.value)}
          error={fieldError(error, 'joiningDate')}
        />
        <Input
          label="Qualification"
          maxLength={150}
          value={form.qualification ?? ''}
          onChange={(e) => update('qualification', e.target.value)}
          error={fieldError(error, 'qualification')}
        />
        <Input
          label="Salary"
          type="number"
          min={0}
          step="0.01"
          value={form.salary ?? ''}
          onChange={(e) => update('salary', e.target.value === '' ? undefined : Number(e.target.value))}
          error={fieldError(error, 'salary')}
        />
      </FormSection>

      <Button type="submit" fullWidth loading={submitting}>
        Create Staff Account
      </Button>
    </form>
  )
}
