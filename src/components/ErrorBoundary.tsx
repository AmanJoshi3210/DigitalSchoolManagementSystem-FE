import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertOctagon } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-red-50">
            <AlertOctagon className="size-7 text-red-500" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Something went wrong</h1>
            <p className="mt-1.5 max-w-sm text-sm text-slate-500">
              An unexpected error occurred. Try reloading the page - if it keeps happening, please contact support.
            </p>
          </div>
          <Button onClick={() => window.location.reload()}>Reload page</Button>
        </div>
      )
    }

    return this.props.children
  }
}
