import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as staffApi from '@/api/staffApi'
import { queryKeys } from './queryKeys'
import type { UpdateStudentRequest } from '@/types'

export function useStudentsQuery() {
  return useQuery({ queryKey: queryKeys.students, queryFn: staffApi.getAllStudents })
}

export function useStudentQuery(id: number) {
  return useQuery({ queryKey: queryKeys.student(id), queryFn: () => staffApi.getStudentById(id), enabled: !!id })
}

export function useStudentEducationStatusQuery(id: number) {
  return useQuery({
    queryKey: queryKeys.studentEducationStatus(id),
    queryFn: () => staffApi.getStudentEducationStatus(id),
    enabled: !!id,
  })
}

export function useStudentAcademicsQuery(id: number) {
  return useQuery({
    queryKey: queryKeys.studentAcademics(id),
    queryFn: () => staffApi.getStudentAcademics(id),
    enabled: !!id,
  })
}

export function useUpdateStudentMutation(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: UpdateStudentRequest) => staffApi.updateStudent(id, request),
    onSuccess: (student) => {
      queryClient.setQueryData(queryKeys.student(id), student)
      queryClient.invalidateQueries({ queryKey: queryKeys.students })
    },
  })
}

export function useDeleteStudentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => staffApi.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students })
    },
  })
}
