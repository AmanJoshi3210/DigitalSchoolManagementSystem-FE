// Mirrors DigitalSchoolManagementSystem.Domain.Enums.*
// System.Text.Json (the backend's serializer) serializes enums as their numeric
// underlying value by default - no JsonStringEnumConverter is registered in Program.cs.
// Values below match each C# enum's declaration order / explicit numeric assignment exactly.

export const Gender = {
  Male: 0,
  Female: 1,
  Other: 2,
} as const
export type Gender = (typeof Gender)[keyof typeof Gender]

export const GenderLabels: Record<number, string> = {
  [Gender.Male]: 'Male',
  [Gender.Female]: 'Female',
  [Gender.Other]: 'Other',
}

export const EnrollmentStatus = {
  Active: 0,
  Graduated: 1,
  TransferredOut: 2,
  Suspended: 3,
  Expelled: 4,
} as const
export type EnrollmentStatus = (typeof EnrollmentStatus)[keyof typeof EnrollmentStatus]

export const EnrollmentStatusLabels: Record<number, string> = {
  [EnrollmentStatus.Active]: 'Active',
  [EnrollmentStatus.Graduated]: 'Graduated',
  [EnrollmentStatus.TransferredOut]: 'Transferred Out',
  [EnrollmentStatus.Suspended]: 'Suspended',
  [EnrollmentStatus.Expelled]: 'Expelled',
}

export const AttendanceStatus = {
  Present: 0,
  Absent: 1,
  Late: 2,
  HalfDay: 3,
  Excused: 4,
} as const
export type AttendanceStatus = (typeof AttendanceStatus)[keyof typeof AttendanceStatus]

export const AttendanceStatusLabels: Record<number, string> = {
  [AttendanceStatus.Present]: 'Present',
  [AttendanceStatus.Absent]: 'Absent',
  [AttendanceStatus.Late]: 'Late',
  [AttendanceStatus.HalfDay]: 'Half Day',
  [AttendanceStatus.Excused]: 'Excused',
}

export const ConversationType = {
  Direct: 1,
  Query: 2,
} as const
export type ConversationType = (typeof ConversationType)[keyof typeof ConversationType]

export const ConversationTypeLabels: Record<number, string> = {
  [ConversationType.Direct]: 'Direct Message',
  [ConversationType.Query]: 'Query',
}

export const ConversationStatus = {
  Open: 1,
  Resolved: 2,
  Closed: 3,
} as const
export type ConversationStatus = (typeof ConversationStatus)[keyof typeof ConversationStatus]

export const ConversationStatusLabels: Record<number, string> = {
  [ConversationStatus.Open]: 'Open',
  [ConversationStatus.Resolved]: 'Resolved',
  [ConversationStatus.Closed]: 'Closed',
}

export const NotificationType = {
  NewConversation: 1,
  NewMessage: 2,
  QueryResolved: 3,
  QueryClosed: 4,
} as const
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType]

export const NotificationTypeLabels: Record<number, string> = {
  [NotificationType.NewConversation]: 'New Conversation',
  [NotificationType.NewMessage]: 'New Message',
  [NotificationType.QueryResolved]: 'Query Resolved',
  [NotificationType.QueryClosed]: 'Query Closed',
}

export const EducationLevel = {
  Undergraduate: 0,
  Graduate: 1,
  PostGraduate: 2,
} as const
export type EducationLevel = (typeof EducationLevel)[keyof typeof EducationLevel]

export const EducationLevelLabels: Record<number, string> = {
  [EducationLevel.Undergraduate]: 'Undergraduate',
  [EducationLevel.Graduate]: 'Graduate',
  [EducationLevel.PostGraduate]: 'Post Graduate',
}

export const StaffRole = {
  Staff: 0,
  Teacher: 1,
  Manager: 2,
  Principal: 3,
  Admin: 4,
} as const
export type StaffRole = (typeof StaffRole)[keyof typeof StaffRole]

export const StaffRoleLabels: Record<number, string> = {
  [StaffRole.Staff]: 'Staff',
  [StaffRole.Teacher]: 'Teacher',
  [StaffRole.Manager]: 'Manager',
  [StaffRole.Principal]: 'Principal',
  [StaffRole.Admin]: 'Admin',
}

// Grantable staff-portal page permissions (mirrors Domain.Constants.StaffPermissionKeys).
// Unlike the enums above, these are stable string identifiers (claim values / DB row values),
// not numeric - deliberately not following this file's numeric-enum-plus-Labels pattern.
export const StaffPermissionKey = {
  ActionHub: 'ActionHub',
  Students: 'Students',
  Programs: 'Programs',
  Messages: 'Messages',
} as const
export type StaffPermissionKey = (typeof StaffPermissionKey)[keyof typeof StaffPermissionKey]

export const ApplicationStatus = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
} as const
export type ApplicationStatus = (typeof ApplicationStatus)[keyof typeof ApplicationStatus]

export const ApplicationStatusLabels: Record<number, string> = {
  [ApplicationStatus.Pending]: 'Pending',
  [ApplicationStatus.Approved]: 'Approved',
  [ApplicationStatus.Rejected]: 'Rejected',
}

export const DocumentStatus = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
} as const
export type DocumentStatus = (typeof DocumentStatus)[keyof typeof DocumentStatus]

export const DocumentStatusLabels: Record<number, string> = {
  [DocumentStatus.Pending]: 'Pending',
  [DocumentStatus.Approved]: 'Approved',
  [DocumentStatus.Rejected]: 'Rejected',
}

export const DocumentType = {
  Passport: 1,
  OfferLetter: 2,
  Certificate: 3,
  ProfilePhoto: 4,
  Other: 5,
} as const
export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType]

export const DocumentTypeLabels: Record<number, string> = {
  [DocumentType.Passport]: 'Passport',
  [DocumentType.OfferLetter]: 'Offer Letter',
  [DocumentType.Certificate]: 'Certificate',
  [DocumentType.ProfilePhoto]: 'Profile Photo',
  [DocumentType.Other]: 'Other',
}

/**
 * Backend enums serialize numerically by default, but this resolves defensively:
 * if the value is already the string name (e.g. "Open"), it's used as-is instead of
 * falling through to "Unknown". Guards against enum-serialization config drift.
 */
export function enumLabel(labels: Record<number, string>, value: number | string | null | undefined): string {
  if (value === null || value === undefined) return 'Unknown'
  if (typeof value === 'number') return labels[value] ?? 'Unknown'
  const asNumber = Number(value)
  if (!Number.isNaN(asNumber) && labels[asNumber]) return labels[asNumber]
  return value
}
