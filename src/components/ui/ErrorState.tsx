import { AlertTriangle, WifiOff } from 'lucide-react'
import { Button } from './Button'
import { getErrorMessage } from '@/utils/errors'

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const message = getErrorMessage(error, 'Something went wrong while loading this data.')
  const isNetworkError = message.toLowerCase().includes('connect to the server')

  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-red-50">
        {isNetworkError ? (
          <WifiOff className="size-6 text-red-500" />
        ) : (
          <AlertTriangle className="size-6 text-red-500" />
        )}
      </div>
      <div>
        <p className="font-medium text-slate-900">Unable to load this data</p>
        <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
