import React from 'react'
import { XCircleIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

interface ErrorBoundaryFallbackProps {
  error: Error
  resetErrorBoundary: () => void
  className?: string
}

export function ErrorBoundaryFallback({
  error,
  resetErrorBoundary,
  className,
}: ErrorBoundaryFallbackProps) {
  return (
    <div
      className={clsx(
        'rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/50',
        className
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            An error occurred
          </h3>
          <div className="mt-2 text-sm text-red-700 dark:text-red-300">
            <p>{error.message}</p>
          </div>
          <div className="mt-4">
            <div className="-mx-2 -my-1.5 flex">
              <button
                type="button"
                onClick={resetErrorBoundary}
                className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50 dark:bg-red-900/50 dark:text-red-200 dark:hover:bg-red-900 dark:focus:ring-offset-red-900"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorBoundaryFallbackProps>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  resetKeys?: any[]
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.error !== null) {
      const { resetKeys = [] } = this.props
      const { resetKeys: prevResetKeys = [] } = prevProps

      if (resetKeys.length !== prevResetKeys.length) {
        this.resetErrorBoundary()
        return
      }

      for (let i = 0; i < resetKeys.length; i++) {
        if (resetKeys[i] !== prevResetKeys[i]) {
          this.resetErrorBoundary()
          return
        }
      }
    }
  }

  resetErrorBoundary = () => {
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    const { children, fallback: FallbackComponent = ErrorBoundaryFallback } = this.props

    if (error !== null) {
      return (
        <FallbackComponent
          error={error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      )
    }

    return children
  }
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  ErrorFallback: React.ComponentType<ErrorBoundaryFallbackProps> = ErrorBoundaryFallback
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={ErrorFallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}
