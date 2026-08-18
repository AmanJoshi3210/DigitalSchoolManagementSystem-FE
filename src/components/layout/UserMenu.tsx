import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/hooks/useAuth'

export function UserMenu() {
  const { session, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  if (!session) return null

  async function handleLogout() {
    setOpen(false)
    await logout()
    toast.success('Signed out')
    navigate('/login', { replace: true })
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100"
      >
        <Avatar firstName={session.firstName} lastName={session.lastName} size="sm" />
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-medium text-slate-900">
            {session.firstName} {session.lastName}
          </span>
          <span className="block text-xs text-slate-500">{session.role}</span>
        </span>
        <ChevronDown className="hidden size-4 text-slate-400 sm:block" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-40 mt-2 w-52 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg">
            <div className="border-b border-slate-100 px-3.5 py-2.5">
              <p className="truncate text-sm font-medium text-slate-900">{session.email}</p>
              <p className="text-xs text-slate-500">{session.username}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-3.5 py-2.5 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="size-4" />
              Log out
            </button>
          </div>
        </>
      )}
    </div>
  )
}
