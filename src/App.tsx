import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Spinner } from '@/components/ui/Spinner'
import { StudentLayout } from '@/components/layout/StudentLayout'
import { StaffLayout } from '@/components/layout/StaffLayout'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { RoleRoute } from '@/routes/RoleRoute'
import { GuestRoute } from '@/routes/GuestRoute'
import { RootRedirect } from '@/routes/RootRedirect'
import { useNotificationHub } from '@/hooks/useNotificationHub'

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const StudentDashboardPage = lazy(() => import('@/pages/student/StudentDashboardPage'))
const StudentProfilePage = lazy(() => import('@/pages/student/StudentProfilePage'))
const StudentDocumentsPage = lazy(() => import('@/pages/student/StudentDocumentsPage'))
const StudentMessagesPage = lazy(() => import('@/pages/student/StudentMessagesPage'))
const StudentProgramsPage = lazy(() => import('@/pages/student/StudentProgramsPage'))
const StudentProgramDetailPage = lazy(() => import('@/pages/student/StudentProgramDetailPage'))
const StaffDashboardPage = lazy(() => import('@/pages/staff/StaffDashboardPage'))
const ActionHubPage = lazy(() => import('@/pages/staff/ActionHubPage'))
const StaffStudentsPage = lazy(() => import('@/pages/staff/StaffStudentsPage'))
const StaffStudentDetailPage = lazy(() => import('@/pages/staff/StaffStudentDetailPage'))
const StaffMessagesPage = lazy(() => import('@/pages/staff/StaffMessagesPage'))
const StaffProgramsPage = lazy(() => import('@/pages/staff/StaffProgramsPage'))
const StaffProgramDetailPage = lazy(() => import('@/pages/staff/StaffProgramDetailPage'))
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner label="Loading" />
    </div>
  )
}

function App() {
  useNotificationHub()

  return (
    <ErrorBoundary>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<RootRedirect />} />

          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute portal="student" />}>
              <Route element={<StudentLayout />}>
                <Route path="/student/dashboard" element={<StudentDashboardPage />} />
                <Route path="/student/profile" element={<StudentProfilePage />} />
                <Route path="/student/documents" element={<StudentDocumentsPage />} />
                <Route path="/student/messages" element={<StudentMessagesPage />} />
                <Route path="/student/programs" element={<StudentProgramsPage />} />
                <Route path="/student/programs/:id" element={<StudentProgramDetailPage />} />
              </Route>
            </Route>

            <Route element={<RoleRoute portal="staff" />}>
              <Route element={<StaffLayout />}>
                <Route path="/staff/dashboard" element={<StaffDashboardPage />} />
                <Route path="/staff/action-hub" element={<ActionHubPage />} />
                <Route path="/staff/students" element={<StaffStudentsPage />} />
                <Route path="/staff/students/:id" element={<StaffStudentDetailPage />} />
                <Route path="/staff/messages" element={<StaffMessagesPage />} />
                <Route path="/staff/programs" element={<StaffProgramsPage />} />
                <Route path="/staff/programs/:id" element={<StaffProgramDetailPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
