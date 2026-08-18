import { GraduationCap, ShieldCheck } from 'lucide-react'
import clsx from 'clsx'
import type { Portal } from '@/types'

export function PortalToggle({ value, onChange }: { value: Portal; onChange: (portal: Portal) => void }) {
  const options: { portal: Portal; label: string; icon: typeof GraduationCap }[] = [
    { portal: 'student', label: 'Student', icon: GraduationCap },
    { portal: 'staff', label: 'Staff / Admin', icon: ShieldCheck },
  ]

  return (
    <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
      {options.map(({ portal, label, icon: Icon }) => (
        <button
          key={portal}
          type="button"
          onClick={() => onChange(portal)}
          className={clsx(
            'flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-colors',
            value === portal ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700',
          )}
        >
          <Icon className="size-4" />
          {label}
        </button>
      ))}
    </div>
  )
}
