import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { PortalToggle } from '@/components/forms/PortalToggle'
import { RegisterStudentForm } from '@/components/forms/RegisterStudentForm'
import { RegisterStaffForm } from '@/components/forms/RegisterStaffForm'
import type { Portal } from '@/types'

export default function RegisterPage() {
  const [portal, setPortal] = useState<Portal>('student')

  return (
    <AuthLayout title="Create your account" subtitle="Register for the student or staff portal">
      <div className="flex flex-col gap-6">
        <PortalToggle value={portal} onChange={setPortal} />

        {portal === 'student' ? <RegisterStudentForm /> : <RegisterStaffForm />}

        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
