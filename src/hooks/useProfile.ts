import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as studentApi from '@/api/studentApi'
import { queryKeys } from './queryKeys'

export function useMyProfileQuery() {
  return useQuery({ queryKey: queryKeys.myProfile, queryFn: studentApi.getMyProfile })
}

export function useMyEducationStatusQuery() {
  return useQuery({ queryKey: queryKeys.myEducationStatus, queryFn: studentApi.getMyEducationStatus })
}

export function useMyAcademicsQuery() {
  return useQuery({ queryKey: queryKeys.myAcademics, queryFn: studentApi.getMyAcademics })
}

export function useUpdateMyProfileMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: studentApi.updateMyProfile,
    onSuccess: (student) => {
      queryClient.setQueryData(queryKeys.myProfile, student)
      queryClient.invalidateQueries({ queryKey: queryKeys.home })
    },
  })
}
