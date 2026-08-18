import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as programApi from '@/api/programApi'
import { queryKeys } from './queryKeys'
import type { CreateProgramRequest, ReviewApplicationRequest, UpdateProgramRequest, UpdateProgramStatusRequest } from '@/types'

export function useProgramsQuery() {
  return useQuery({ queryKey: queryKeys.programs, queryFn: programApi.getAllPrograms })
}

export function useProgramQuery(id: number) {
  return useQuery({ queryKey: queryKeys.program(id), queryFn: () => programApi.getProgramById(id), enabled: !!id })
}

export function useCreateProgramMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: CreateProgramRequest) => programApi.createProgram(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.programs })
    },
  })
}

export function useUpdateProgramMutation(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: UpdateProgramRequest) => programApi.updateProgram(id, request),
    onSuccess: (program) => {
      queryClient.setQueryData(queryKeys.program(id), program)
      queryClient.invalidateQueries({ queryKey: queryKeys.programs })
    },
  })
}

export function useUpdateProgramStatusMutation(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: UpdateProgramStatusRequest) => programApi.updateProgramStatus(id, request),
    onSuccess: (program) => {
      queryClient.setQueryData(queryKeys.program(id), program)
      queryClient.invalidateQueries({ queryKey: queryKeys.programs })
    },
  })
}

export function useProgramApplicationsQuery(programId: number) {
  return useQuery({
    queryKey: queryKeys.programApplications(programId),
    queryFn: () => programApi.getProgramApplications(programId),
    enabled: !!programId,
  })
}

export function useApplyToProgramMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (programId: number) => programApi.applyToProgram(programId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myApplications })
    },
  })
}

export function useMyApplicationsQuery() {
  return useQuery({ queryKey: queryKeys.myApplications, queryFn: programApi.getMyApplications })
}

export function useReviewApplicationMutation(programId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ applicationId, request }: { applicationId: number; request: ReviewApplicationRequest }) =>
      programApi.reviewApplication(applicationId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.programApplications(programId) })
    },
  })
}

export function usePendingApplicationsQuery() {
  return useQuery({ queryKey: queryKeys.pendingApplications, queryFn: programApi.getPendingApplications })
}

// Same review call as useReviewApplicationMutation, but for the Action Hub, which reviews
// applications across programs and isn't bound to a single programId.
export function useReviewPendingApplicationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ applicationId, request }: { applicationId: number; request: ReviewApplicationRequest }) =>
      programApi.reviewApplication(applicationId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pendingApplications })
      queryClient.invalidateQueries({ queryKey: queryKeys.myApplications })
    },
  })
}
