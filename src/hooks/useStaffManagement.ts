import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as staffManagementApi from '@/api/staffManagementApi'
import { queryKeys } from './queryKeys'
import type { SetStaffPermissionsRequest } from '@/types'

export function useStaffListQuery() {
  return useQuery({ queryKey: queryKeys.staffList, queryFn: staffManagementApi.getAllStaff })
}

export function usePermissionCatalogQuery() {
  // Fixed 4-item catalog defined in backend code, not user data - never goes stale.
  return useQuery({
    queryKey: queryKeys.permissionCatalog,
    queryFn: staffManagementApi.getPermissionCatalog,
    staleTime: Infinity,
  })
}

export function useSetStaffPermissionsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ staffUserId, request }: { staffUserId: number; request: SetStaffPermissionsRequest }) =>
      staffManagementApi.setStaffPermissions(staffUserId, request),
    onSuccess: (_result, { staffUserId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staffList })
      queryClient.invalidateQueries({ queryKey: queryKeys.staffPermissions(staffUserId) })
    },
  })
}
