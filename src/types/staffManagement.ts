import type { StaffRole } from './enums'

// Matches StaffListItemDto
export interface StaffListItem {
  staffUserId: number
  userId: number
  employeeCode: string
  firstName: string
  lastName: string
  email: string
  staffRole: StaffRole
  department?: string | null
  isActive: boolean
  permissions: string[]
}

// Matches PermissionCatalogItemDto
export interface PermissionCatalogItem {
  key: string
  label: string
}

// Matches StaffPermissionsDto
export interface StaffPermissions {
  staffUserId: number
  permissions: string[]
}

// Matches SetStaffPermissionsDto
export interface SetStaffPermissionsRequest {
  permissions: string[]
}
