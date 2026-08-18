import type { ReactNode } from 'react'

export interface ProfileInfoItem {
  label: string
  value: ReactNode
}

export function ProfileInfoGrid({ items }: { items: ProfileInfoItem[] }) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
      {items.map(({ label, value }) => (
        <div key={label}>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
          <dd className="mt-1 text-sm text-slate-900">{value || <span className="text-slate-400">—</span>}</dd>
        </div>
      ))}
    </dl>
  )
}
