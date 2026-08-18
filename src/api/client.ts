import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { ApiError, AuthResponse, Portal } from '@/types'
import { authStore } from '@/utils/authStore'

const AUTH_PATH_SEGMENT = '/auth/'

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean
  }
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Separate instance for refresh calls so the response interceptor below never intercepts
// (and potentially recurses on) the refresh request itself.
const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const session = authStore.getSession()
  if (session?.accessToken) {
    config.headers.set('Authorization', `Bearer ${session.accessToken}`)
  }
  return config
})

let refreshPromise: Promise<AuthResponse> | null = null

async function refreshSession(portal: Portal, refreshToken: string): Promise<AuthResponse> {
  const { data } = await refreshClient.post<AuthResponse>(`/auth/${portal}/refresh-token`, { refreshToken })
  return data
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig | undefined
    const isAuthEndpoint = config?.url?.includes(AUTH_PATH_SEGMENT)

    if (error.response?.status === 401 && config && !config._retry && !isAuthEndpoint) {
      const session = authStore.getSession()

      if (!session?.refreshToken) {
        authStore.setSession(null)
        return Promise.reject(normalizeError(error))
      }

      config._retry = true

      try {
        refreshPromise ??= refreshSession(session.portal, session.refreshToken)
        const refreshed = await refreshPromise
        authStore.setSession({ ...refreshed, portal: session.portal })

        config.headers.set('Authorization', `Bearer ${refreshed.accessToken}`)
        return apiClient(config)
      } catch (refreshError) {
        authStore.setSession(null)
        return Promise.reject(normalizeError(refreshError as AxiosError))
      } finally {
        refreshPromise = null
      }
    }

    return Promise.reject(normalizeError(error))
  },
)

interface ProblemDetailsBody {
  message?: string
  title?: string
  errors?: Record<string, string[]>
}

function normalizeError(error: AxiosError): ApiError {
  if (!error.response) {
    return {
      status: null,
      message: 'Unable to connect to the server. Check your connection and try again.',
    }
  }

  const { status, data } = error.response
  const body = (data ?? {}) as ProblemDetailsBody

  if (status === 400 && body.errors) {
    const fieldErrors = body.errors
    const firstMessage = Object.values(fieldErrors)[0]?.[0]
    return {
      status,
      message: firstMessage ?? 'Please correct the highlighted fields and try again.',
      fieldErrors,
    }
  }

  const fallbackByStatus: Record<number, string> = {
    401: 'Your session has expired. Please log in again.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    409: 'This conflicts with existing data.',
  }

  const message =
    body.message ?? body.title ?? fallbackByStatus[status] ?? (status >= 500
      ? 'Something went wrong on our end. Please try again shortly.'
      : `Request failed (${status}).`)

  return { status, message }
}
