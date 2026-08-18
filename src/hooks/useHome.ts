import { useQuery } from '@tanstack/react-query'
import * as homeApi from '@/api/homeApi'
import { queryKeys } from './queryKeys'

export function useHomeQuery() {
  return useQuery({ queryKey: queryKeys.home, queryFn: homeApi.getHome })
}
