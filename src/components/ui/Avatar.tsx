import clsx from 'clsx'
import { initials } from '@/utils/formatters'

const palette = [
  'bg-brand-100 text-brand-700',
  'bg-purple-100 text-purple-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
]

function colorFor(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return palette[hash % palette.length]
}

export function Avatar({
  firstName,
  lastName,
  imageUrl,
  size = 'md',
  className,
}: {
  firstName: string
  lastName: string
  imageUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizeClasses = { sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-14 text-lg' }[size]

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={`${firstName} ${lastName}`}
        className={clsx('rounded-full object-cover', sizeClasses, className)}
      />
    )
  }

  return (
    <div
      className={clsx(
        'flex shrink-0 items-center justify-center rounded-full font-semibold',
        sizeClasses,
        colorFor(`${firstName}${lastName}`),
        className,
      )}
    >
      {initials(firstName, lastName)}
    </div>
  )
}
