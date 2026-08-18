# Digital School Management System — Frontend

A production frontend (React 19 + TypeScript + Vite + Tailwind v4 + TanStack Query +
React Router v7) for `DigitalSchoolManagementSystem-BE` (.NET 10, Clean Architecture).
Two portals — Student and Staff/Admin — backed 1:1 by the real backend endpoints; there is
no mock data.

## Tech stack

- **React 19** + **TypeScript**, built with **Vite**
- **Tailwind CSS v4** (CSS-first config via `@theme` in `src/index.css`)
- **TanStack Query v5** for server state (caching, polling, mutations)
- **React Router v7** for routing, lazy-loaded pages
- **axios** for HTTP, with a request/response interceptor pipeline (auth header injection,
  single-flight refresh-on-401, normalized error shape)
- **@microsoft/signalr** for real-time conversation/notification updates
- **react-hot-toast** for toasts

## Getting started

Prerequisites: Node 20+, and the backend (`DigitalSchoolManagementSystem-BE`) runnable via
.NET 10 with LocalDB (`(localdb)\MSSQLLocalDB`).

```bash
# Backend (from DigitalSchoolManagementSystem-BE/DigitalSchoolManagementSystem.API)
dotnet run --urls http://localhost:5081

# Frontend (from this directory)
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`. The backend's CORS policy
(`appsettings.json` → `Cors:AllowedOrigins`) only allows `http://localhost:3000` and
`http://localhost:5173`, so keep the frontend on port 5173.

### Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc -b`) then production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run `oxlint` |

### Environment

`.env.development`:

```
VITE_API_BASE_URL=http://localhost:5081/api
VITE_HUB_URL=http://localhost:5081/hubs/notifications
```

Path alias `@/*` resolves to `src/*` (configured in both `tsconfig.app.json` and
`vite.config.ts`).

## Project structure

```
src/
  api/          axios client + one module per backend resource (authApi, studentApi, staffApi, messageApi, notificationApi, homeApi)
  types/        hand-mirrored backend DTOs/enums
  context/      AuthContext (React) backed by authStore.ts (framework-agnostic session store)
  routes/       ProtectedRoute, RoleRoute, GuestRoute, RootRedirect
  hooks/        TanStack Query hooks per resource + useNotificationHub (SignalR)
  components/
    ui/         design system primitives (Button, Input, Modal, Card, ...)
    layout/     PortalLayout, StaffLayout, StudentLayout, UserMenu, NotificationBell
    forms/      Register/Edit forms for auth + student/profile
    messages/   MessagingWorkspace and its child components
    students/   status badges, profile info grid
  pages/
    auth/       LoginPage, RegisterPage
    student/    StudentDashboardPage, StudentProfilePage, StudentMessagesPage
    staff/      StaffDashboardPage, StaffStudentsPage, StaffStudentDetailPage, StaffMessagesPage
    NotFoundPage.tsx, UnauthorizedPage.tsx
```

## Authentication model

The backend has **two independent auth systems**, not a unified login:

- `POST /api/auth/student/{login,register}` and `POST /api/auth/staff/{login,register}`
- `POST /api/auth/{portal}/refresh-token`, `POST /api/auth/{portal}/revoke-token`

The frontend's session (`localStorage` key `dsms_session`) stores which portal issued the
token alongside the access/refresh tokens, so the right refresh endpoint is used and the
right portal home page is redirected to. `RoleRoute` enforces the boundary at the router
level: a Student session hitting `/staff/*` (or vice versa) is redirected to
`/unauthorized`.

## Feature → Endpoint mapping

### Auth

| Feature | Method & Endpoint |
| --- | --- |
| Student/Staff login | `POST /api/auth/{portal}/login` |
| Student/Staff register | `POST /api/auth/{portal}/register` |
| Silent token refresh (401 interceptor) | `POST /api/auth/{portal}/refresh-token` |
| Logout | `POST /api/auth/{portal}/revoke-token` |

### Home / dashboard

| Feature | Method & Endpoint |
| --- | --- |
| Student & Staff dashboard summary | `GET /api/home` (role-shaped response) |

### Student self-service ("me" endpoints)

| Feature | Method & Endpoint |
| --- | --- |
| View own profile | `GET /api/students/me` |
| Edit own profile | `PUT /api/students/me` |
| Own education status | `GET /api/students/me/education-status` |
| Own academics summary (attendance %, subjects, recent results) | `GET /api/students/me/academics` |

### Staff student management

| Feature | Method & Endpoint |
| --- | --- |
| List all students (client-side search/sort) | `GET /api/students` |
| Student detail | `GET /api/students/{id}` |
| Student education status | `GET /api/students/{id}/education-status` |
| Student academics summary | `GET /api/students/{id}/academics` |
| Edit a student | `PUT /api/students/{id}` |
| Remove a student | `DELETE /api/students/{id}` |

### Messaging

| Feature | Method & Endpoint |
| --- | --- |
| Contacts allowed to message (role-filtered by backend) | `GET /api/conversations/contacts` |
| List my conversations | `GET /api/conversations` |
| Conversation detail | `GET /api/conversations/{id}` |
| Conversation messages (paginated) | `GET /api/conversations/{id}/messages?page=&pageSize=` |
| Start a direct conversation (staff↔staff, staff↔student) | `POST /api/conversations/direct` |
| Raise a query (student→staff, subject required) | `POST /api/conversations/query` |
| Send a message | `POST /api/conversations/{id}/messages` |
| Mark conversation read | `PUT /api/conversations/{id}/read` |
| Change query status (staff only: Open/Resolved/Closed) | `PUT /api/conversations/{id}/status` |

### Notifications

| Feature | Method & Endpoint |
| --- | --- |
| List notifications | `GET /api/notifications?unreadOnly=&page=&pageSize=` |
| Unread count (sidebar/bell badges) | `GET /api/notifications/unread-count` |
| Mark one read | `PUT /api/notifications/{id}/read` |
| Mark all read | `PUT /api/notifications/read-all` |

### Real-time

`useNotificationHub` connects to `/hubs/notifications` via SignalR and invalidates the
relevant TanStack Query caches on `ReceiveMessage` / `ReceiveNotification` /
`ConversationUpdated`. It's purely additive: REST polling (`refetchInterval` on the
conversations/messages/notifications queries) keeps data fresh even if the socket never
connects. The SignalR client is configured with `withCredentials: false` — auth is
bearer-token, not cookies, and the backend's CORS policy doesn't send
`Access-Control-Allow-Credentials`, so the default `withCredentials: true` causes the
browser to silently block the `/negotiate` response.

## Documented gaps

These are intentional scope decisions, not bugs:

- **No unified login.** Two portal-specific endpoints exist on the backend by design; the
  frontend's `LoginPage`/`RegisterPage` expose a Student/Staff toggle rather than pretending
  there's one login system.
- **No file upload for profile pictures.** `profileImageUrl` is a plain URL text field
  because the backend has no file-upload endpoint — users paste a link to an already-hosted
  image.
- **No server-side pagination/search/sort on the students list.** `GET /api/students`
  returns the full roster; `StaffStudentsPage` does search/sort client-side.
- **No forgot-password flow.** No such endpoint exists on the backend, so none was built.
- **Attendance/Exams/Subjects/ExamResults have full backend CRUD**
  (`AttendanceController`/`ExamsController`/`SubjectsController`/`ExamResultsController`)
  but the frontend only surfaces their summary numbers (attendance %, upcoming exam count,
  subjects, recent results) via the academics-summary endpoints. Full CRUD screens for these
  resources were out of scope for this pass, per the original page list in the spec.
- **Direct messages have no subject field** — only `content` (and `initialMessage` when
  starting one). Only Query conversations carry a subject.

## Test accounts (local dev DB)

- Student: `teststudent2026` / `TestPass123!`
- Staff: register your own via `/register` → "Staff / Admin" tab (no seeded staff account
  exists by default)
