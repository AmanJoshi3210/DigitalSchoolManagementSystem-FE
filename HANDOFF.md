# Handoff — Digital School Management System frontend

**STATUS: all items below are complete as of 2026-08-12 (second session).** SignalR fix
verified live, full manual QA pass done (staff auth/role-boundaries, student CRUD, messaging
end-to-end including query status transitions, profile edit, logout, mobile nav, 404), a
`README.md` was written (setup, API mapping table, documented gaps), and a final `oxlint`
pass confirmed only the one pre-existing, intentionally-left warning remains. See
`README.md` for the maintained reference going forward - this file is kept as a historical
record of that first build session.

Original status as of 2026-08-12, end of first session, below (kept for context):

## What this is

A production frontend (React 19 + TypeScript + Vite 8 + Tailwind v4 + TanStack Query +
react-router-dom v7) for the existing `DigitalSchoolManagementSystem-BE` (.NET 10, Clean
Architecture) sitting alongside it in the repo. Two portals: Student and Staff/Admin, backed
1:1 by the real backend endpoints - no mock data anywhere.

## Done

All 84 source files under `src/` are written and the app **builds and type-checks clean**
(`npx tsc -b` and `npm run build` both pass with zero errors). Confirmed working live against
the real backend in a browser during this session (registration → student dashboard render
with real API data).

- **Types** (`src/types/`): hand-mirrored from the backend's C# DTOs/enums exactly, including
  the fact that enums serialize as numbers (System.Text.Json default - no
  `JsonStringEnumConverter` registered in `Program.cs`).
- **API layer** (`src/api/`): axios client with request/response interceptors - auto-attaches
  bearer token, auto-refreshes on 401 (single in-flight refresh, request queue-safe), and
  normalizes every error shape (400 ValidationProblemDetails, 401/403/404/409, network, 500+)
  into one `ApiError`. `authApi`, `studentApi` ("me" endpoints), `staffApi` (admin endpoints
  over `/api/students`), `messageApi`, `notificationApi`, `homeApi`.
- **Auth** (`src/context/AuthContext.tsx`, `src/utils/authStore.ts`): framework-agnostic
  session store in `authStore.ts` (so the axios interceptor can clear the session on refresh
  failure without importing React); `AuthContext` wraps it for components. Session persisted
  to `localStorage` under key `dsms_session`, including which portal (`student`/`staff`)
  issued it, since the backend has **two separate auth systems**
  (`/api/auth/student/*` and `/api/auth/staff/*`, not a unified login).
- **Routing** (`src/routes/`, `src/App.tsx`): `ProtectedRoute` (auth required),
  `RoleRoute` (portal must match - a Student session hitting `/staff/*` bounces to
  `/unauthorized`, and vice versa), `GuestRoute` (already-authed users can't see
  `/login`/`/register`). Lazy-loaded pages via `React.lazy` + `Suspense`. Top-level
  `ErrorBoundary` for uncaught render errors.
- **Design system** (`src/components/ui/`): Button, Input, PasswordInput, Select, Textarea,
  Card, Badge, Avatar, Spinner, Skeleton, EmptyState, ErrorState, Modal, ConfirmDialog,
  StatCard, PageHeader. Tailwind v4 CSS-first config in `src/index.css` (`@theme` block,
  brand color scale).
- **Auth pages**: `LoginPage` (portal toggle Student/Staff, show/hide password),
  `RegisterPage` (tabs, full `RegisterStudentRequestDto`/`RegisterStaffRequestDto` fields,
  field-level backend validation errors mapped back to inputs via `fieldError()` in
  `utils/errors.ts`).
- **Student portal**: `StudentLayout` (sidebar/header/mobile drawer), `StudentDashboardPage`
  (`GET /api/home`), `StudentProfilePage` (view + edit via `PUT /api/students/me`, plus
  education-status and academics-summary cards), `StudentMessagesPage`.
- **Staff portal**: `StaffLayout`, `StaffDashboardPage` (`GET /api/home` staffInfo +
  student count), `StaffStudentsPage` (`GET /api/students`, client-side search/sort - backend
  has no server-side pagination/filtering), `StaffStudentDetailPage` (view/edit/delete a
  student, deep-links to messaging), `StaffMessagesPage`.
- **Messaging** (`src/components/messages/`, `src/hooks/useMessaging.ts`):
  `MessagingWorkspace` is a single shared two-pane (list + thread) component parametrized by
  `portal`, reused by both `StudentMessagesPage` and `StaffMessagesPage` rather than
  duplicated. Respects the backend's actual rules (see
  `DigitalSchoolManagementSystem-BE/Message&notification.md`): students can only start
  conversations with staff (Direct or a subject-bearing Query); staff can message
  staff-or-student; only staff can resolve/close a Query; Direct messages have **no subject
  field** (only `SendMessageDto.content` / `StartDirectConversationDto.initialMessage` -
  the ASCII mock in the original spec showing a Subject field for staff direct messages does
  **not** match the real `StartDirectConversationDto`, so it was intentionally not built that
  way).
- **Real-time**: `useNotificationHub` connects to `/hubs/notifications` and invalidates the
  relevant TanStack Query caches on `ReceiveMessage`/`ReceiveNotification`/
  `ConversationUpdated`. Purely additive - REST polling (`refetchInterval` on conversations/
  messages/notifications queries) covers it if the socket never connects.

## Known issue found + fixed this session (needs re-verification)

The SignalR connection was failing with `TypeError: Failed to fetch` on the `/negotiate`
call. Root cause: `@microsoft/signalr`'s `HttpConnection` defaults `withCredentials: true`,
which makes the browser require an `Access-Control-Allow-Credentials: true` response header:
the backend's CORS policy (`Program.cs`) never sends one (it's plain bearer-token auth, no
cookies), so the browser silently blocked the response even though the server itself
returned 200 (confirmed via manual `fetch()` with an explicit `Authorization` header from the
page console, and via `curl`).

**Fix applied**: `src/hooks/useNotificationHub.ts` now passes `withCredentials: false` in the
`.withUrl()` options. This is a frontend-only fix - no backend change needed or made.

**Not yet re-verified**: the browser tool (claude-in-chrome MCP) disconnected mid-session
right after the fix was written and before it could be confirmed live. `npx tsc -b` passes,
so it compiles, but **the next session should reconnect a browser, log in, and check the
console for the `ReceiveMessage`/`ReceiveNotification` connection succeeding with no
"Failed to fetch" error** before considering this fully done.

## Left to do

1. **Re-verify the SignalR fix** (see above) - highest priority, quick check.
2. **Manual QA pass** (only student registration + dashboard were exercised live so far):
   - Staff registration/login, and role-boundary redirect (log in as student, manually
     navigate to `/staff/dashboard` → should land on `/unauthorized`, and vice versa).
   - Staff students list search/sort, student detail view, edit (`PUT /api/students/{id}`),
     delete (`DELETE /api/students/{id}` + confirm dialog), and the "Message" button
     deep-link (`/staff/messages?to={userId}`) auto-opening the new-conversation modal
     pre-filled.
   - Messaging end-to-end: student starts a Direct message to staff, student raises a Query
     (subject required), staff replies, staff changes Query status Open→Resolved→Closed,
     confirm a message into a Closed query is rejected/disabled correctly, unread badges
     update on the sidebar "Messages" nav item and the notification bell.
   - Student profile edit (`PUT /api/students/me`), logout (calls
     `POST /api/auth/{portal}/revoke-token` then clears local session), mobile drawer nav at
     a narrow viewport, `/unauthorized` and unknown-route `*` → `NotFoundPage`.
3. **Write `README.md`** in this project (currently only `HANDOFF.md` exists) with:
   - Setup/run instructions (see below).
   - The Feature → Endpoint → Method mapping table (already fully known from the backend
     read-through this session; see "API surface used" below - just needs to be written up).
   - A documented-gaps section: no unified login (two portal-specific endpoints, by design);
     `profileImageUrl` is a plain URL text field, there is no file-upload endpoint on the
     backend; `GET /api/students` has no server-side pagination/search/sort so the frontend
     does it client-side; no forgot-password endpoint exists so none was built; Attendance/
     Exams/Subjects/ExamResults have full backend CRUD
     (`AttendanceController`/`ExamsController`/`SubjectsController`/`ExamResultsController`)
     but only their summary numbers (attendance %, upcoming exam count, subjects, recent
     results) are surfaced in the UI - full CRUD screens for those were out of scope for this
     pass per the original spec's explicit page list.
4. **Final `oxlint` pass**: two pre-existing warnings, both reviewed and intentionally left as
   informational (see their inline comments): `AuthContext.tsx` (fast-refresh: context +
   provider in one file, common/idiomatic), `useNotificationHub.ts`
   (`exhaustive-deps` on the reconnect effect - deliberately keyed on `session?.userId`, not
   the whole session object, explained in a comment above the dependency array). Re-run
   `npx oxlint` to confirm nothing new crept in.

## How to resume

Both dev servers were left running in the background and **may still be alive** (OS
processes survive a Claude session/MCP disconnect even though the harness loses its
handle to them) - check before starting new ones:

```
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5081/api/home   # 401 = backend is up
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5173/           # 200 = frontend is up
```

If not running:

```
# Backend (from DigitalSchoolManagementSystem-BE/DigitalSchoolManagementSystem.API)
dotnet run --urls http://localhost:5081

# Frontend (from DigitalSchoolManagementSystem-FE)
npm run dev
```

LocalDB (`(localdb)\MSSQLLocalDB`) already has migrations applied - no `dotnet ef database
update` needed unless the DB was reset.

A test student account already exists in the database from this session's live test:
- username `teststudent2026` / email `teststudent2026@example.com` / password `TestPass123!`
- Admission No. `ADM-TEST-001`, Grade 10 - Section A

No staff test account exists yet - register one via `/register` → "Staff / Admin" tab to QA
the staff portal.

## Orientation for a fresh session

- Env config: `.env.development` points at `http://localhost:5081/api` and
  `http://localhost:5081/hubs/notifications`. Backend CORS
  (`DigitalSchoolManagementSystem-BE/.../appsettings.json` → `Cors:AllowedOrigins`) is
  locked to `http://localhost:3000` and `http://localhost:5173` - keep the frontend on 5173.
- Path alias `@/*` → `src/*` (configured in both `tsconfig.app.json` and `vite.config.ts`).
- `npx tsc -b` for a fast full-project type check; `npm run build` for the real production
  build; `npm run dev` for local dev; `npx oxlint` for linting.
