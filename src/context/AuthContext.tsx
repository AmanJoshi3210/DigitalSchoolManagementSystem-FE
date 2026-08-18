import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react'
import * as authApi from '@/api/authApi'
import { authStore } from '@/utils/authStore'
import type {
  LoginRequest,
  Portal,
  RegisterStaffRequest,
  RegisterStudentRequest,
  StoredSession,
} from '@/types'

export interface AuthContextValue {
  session: StoredSession | null
  isAuthenticated: boolean
  login: (portal: Portal, request: LoginRequest) => Promise<StoredSession>
  registerStudent: (request: RegisterStudentRequest) => Promise<StoredSession>
  registerStaff: (request: RegisterStaffRequest) => Promise<StoredSession>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(() => authStore.getSession())

  useEffect(() => authStore.subscribe(setSession), [])

  const login = useCallback(async (portal: Portal, request: LoginRequest) => {
    const response = await authApi.login(portal, request)
    const next: StoredSession = { ...response, portal }
    authStore.setSession(next)
    return next
  }, [])

  const registerStudent = useCallback(async (request: RegisterStudentRequest) => {
    const response = await authApi.registerStudent(request)
    const next: StoredSession = { ...response, portal: 'student' }
    authStore.setSession(next)
    return next
  }, [])

  const registerStaff = useCallback(async (request: RegisterStaffRequest) => {
    const response = await authApi.registerStaff(request)
    const next: StoredSession = { ...response, portal: 'staff' }
    authStore.setSession(next)
    return next
  }, [])

  const logout = useCallback(async () => {
    const current = authStore.getSession()
    if (current) {
      try {
        await authApi.revokeToken(current.portal, { refreshToken: current.refreshToken })
      } catch {
        // Best-effort server-side revocation - clear the local session regardless.
      }
    }
    authStore.setSession(null)
  }, [])

  const value: AuthContextValue = {
    session,
    isAuthenticated: session !== null,
    login,
    registerStudent,
    registerStaff,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
