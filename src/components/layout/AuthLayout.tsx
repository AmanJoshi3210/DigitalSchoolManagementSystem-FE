import type { ReactNode } from 'react'
import { GraduationCap, MessageSquare, ShieldCheck, Users } from 'lucide-react'

const highlights = [
  { icon: Users, text: 'Manage students and staff from one place' },
  { icon: MessageSquare, text: 'Direct messaging between staff and students' },
  { icon: ShieldCheck, text: 'Role-based access for every portal' },
]

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-slate-900 p-12 text-white lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-white/15">
            <GraduationCap className="size-5" />
          </div>
          <span className="text-lg font-semibold">Digital School Management</span>
        </div>

        <div className="max-w-md">
          <h1 className="text-3xl font-semibold leading-tight">
            Everything your school needs, in one connected system.
          </h1>
          <ul className="mt-8 space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-brand-50">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="size-4" />
                </div>
                <span className="text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-brand-200/70">© {new Date().getFullYear()} Digital School Management System</p>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex size-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              <GraduationCap className="size-5" />
            </div>
            <span className="text-lg font-semibold text-slate-900">Digital School Management</span>
          </div>

          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
