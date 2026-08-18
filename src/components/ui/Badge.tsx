import type { ReactNode } from 'react'
import clsx from 'clsx'

type Tone = 'gray' | 'green' | 'red' | 'amber' | 'blue' | 'purple'

const toneClasses: Record<Tone, string> = {
  gray: 'bg-slate-100 text-slate-700',
  green: 'bg-emerald-50 text-emerald-700',
  red: 'bg-red-50 text-red-700',
  amber: 'bg-amber-50 text-amber-700',
  blue: 'bg-brand-50 text-brand-700',
  purple: 'bg-purple-50 text-purple-700',
}

export function Badge({ tone = 'gray', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
