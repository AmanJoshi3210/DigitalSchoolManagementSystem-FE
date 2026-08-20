import { apiClient } from './client'
import type { PermissionCatalogItem, SetStaffPermissionsRequest, StaffListItem, StaffPermissions } from '@/types'

// Admin-only calls (StaffRole.Admin, enforced server-side by RequireStaffRoleAttribute) for
// managing which staff pages other staff users can see.

// GET /api/staff-management/staff
export async function getAllStaff(): Promise<StaffListItem[]> {
  const { data } = await apiClient.get<StaffListItem[]>('/staff-management/staff')
  return data
}

// GET /api/staff-management/permissions/catalog
export async function getPermissionCatalog(): Promise<PermissionCatalogItem[]> {
  const { data } = await apiClient.get<PermissionCatalogItem[]>('/staff-management/permissions/catalog')
  return data
}

// GET /api/staff-management/staff/{staffUserId}/permissions
export async function getStaffPermissions(staffUserId: number): Promise<StaffPermissions> {
  const { data } = await apiClient.get<StaffPermissions>(`/staff-management/staff/${staffUserId}/permissions`)
  return data
}

// PUT /api/staff-management/staff/{staffUserId}/permissions
export async function setStaffPermissions(
  staffUserId: number,
  request: SetStaffPermissionsRequest,
): Promise<StaffPermissions> {
  const { data } = await apiClient.put<StaffPermissions>(`/staff-management/staff/${staffUserId}/permissions`, request)
  return data
}
