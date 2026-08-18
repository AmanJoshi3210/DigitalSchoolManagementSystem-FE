import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { PortalToggle } from '@/components/forms/PortalToggle'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { getErrorMessage } from '@/utils/errors'
import { portalHomePath } from '@/utils/portal'
import type { Portal } from '@/types'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [portal, setPortal] = useState<Portal>('student')
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(portal, { usernameOrEmail, password })

      const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname
      const portalPrefix = portal === 'student' ? '/student' : '/staff'
      const target = from?.startsWith(portalPrefix) ? from : portalHomePath(portal)

      toast.success('Welcome back!')
      navigate(target, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to sign in. Please check your credentials.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to access your portal">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <PortalToggle value={portal} onChange={setPortal} />

        {error && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
            {error}
          </div>
        )}

        <Input
          label="Username or Email"
          name="usernameOrEmail"
          autoComplete="username"
          required
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          placeholder="jane.doe or jane@school.edu"
        />

        <PasswordInput
          name="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <Button type="submit" fullWidth loading={submitting}>
          Sign in
        </Button>

        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-brand-600 hover:text-brand-700">
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
