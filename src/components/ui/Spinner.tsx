import { Loader2 } from 'lucide-react'
import clsx from 'clsx'

export function Spinner({ className, label = 'Loading' }: { className?: string; label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-slate-400" role="status" aria-live="polite">
      <Loader2 className={clsx('size-5 animate-spin', className)} />
      <span className="text-sm">{label}…</span>
    </div>
  )
}
