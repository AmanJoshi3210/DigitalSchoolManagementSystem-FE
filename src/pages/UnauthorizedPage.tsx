import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { portalHomePath } from '@/utils/portal'

export default function UnauthorizedPage() {
  const { session } = useAuth()
  const homePath = session ? portalHomePath(session.portal) : '/login'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-red-50">
        <ShieldAlert className="size-7 text-red-500" />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-slate-900">You don&apos;t have access to this page</h1>
        <p className="mt-1.5 max-w-sm text-sm text-slate-500">
          {session
            ? `Your ${session.role} account doesn't have permission to view that portal.`
            : 'Please sign in to continue.'}
        </p>
      </div>
      <Link to={homePath}>
        <Button>Go to my dashboard</Button>
      </Link>
    </div>
  )
}
