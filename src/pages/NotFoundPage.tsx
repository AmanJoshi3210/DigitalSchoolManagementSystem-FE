import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { portalHomePath } from '@/utils/portal'

export default function NotFoundPage() {
  const { session } = useAuth()
  const homePath = session ? portalHomePath(session.portal) : '/login'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-slate-100">
        <Compass className="size-7 text-slate-400" />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-1.5 max-w-sm text-sm text-slate-500">The page you&apos;re looking for doesn&apos;t exist or may have moved.</p>
      </div>
      <Link to={homePath}>
        <Button>Take me back</Button>
      </Link>
    </div>
  )
}
