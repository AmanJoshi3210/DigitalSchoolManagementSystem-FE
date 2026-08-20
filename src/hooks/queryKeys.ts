export const queryKeys = {
  home: ['home'] as const,

  myProfile: ['students', 'me'] as const,
  myEducationStatus: ['students', 'me', 'education-status'] as const,
  myAcademics: ['students', 'me', 'academics'] as const,

  students: ['students'] as const,
  student: (id: number) => ['students', id] as const,
  studentEducationStatus: (id: number) => ['students', id, 'education-status'] as const,
  studentAcademics: (id: number) => ['students', id, 'academics'] as const,

  contacts: ['conversations', 'contacts'] as const,
  conversations: ['conversations'] as const,
  conversation: (id: number) => ['conversations', id] as const,
  messages: (id: number) => ['conversations', id, 'messages'] as const,

  notifications: (unreadOnly: boolean) => ['notifications', { unreadOnly }] as const,
  unreadCount: ['notifications', 'unread-count'] as const,

  programs: ['programs'] as const,
  program: (id: number) => ['programs', id] as const,
  programApplications: (programId: number) => ['programs', programId, 'applications'] as const,
  myApplications: ['programs', 'me', 'applications'] as const,
  pendingApplications: ['programs', 'applications', 'pending'] as const,

  myDocuments: ['documents', 'me'] as const,
  userDocuments: (userId: number) => ['documents', 'user', userId] as const,
  pendingDocuments: ['documents', 'pending'] as const,

  staffList: ['staff-management', 'staff'] as const,
  permissionCatalog: ['staff-management', 'permission-catalog'] as const,
  staffPermissions: (staffUserId: number) => ['staff-management', 'staff', staffUserId, 'permissions'] as const,
}
