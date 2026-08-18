import type { ComponentType } from 'react'
import clsx from 'clsx'

type Tone = 'brand' | 'emerald' | 'amber' | 'purple' | 'rose'

const toneClasses: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  purple: 'bg-purple-50 text-purple-600',
  rose: 'bg-rose-50 text-rose-600',
}

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'brand',
  hint,
}: {
  label: string
  value: string | number
  icon: ComponentType<{ className?: string }>
  tone?: Tone
  hint?: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className={clsx('flex size-9 items-center justify-center rounded-lg', toneClasses[tone])}>
          <Icon className="size-4.5" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
