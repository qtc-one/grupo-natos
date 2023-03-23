import { UserSession } from '@/configs/session'
import { UserVenturesAPIResponse } from '@/pages/api/ventures'
import useSWR from 'swr'

export default function useVentures(user: UserSession | undefined) {
  const { data, error } = useSWR<UserVenturesAPIResponse>(user?.isLogged ? `/api/ventures` : null)

  return {
    data: data?.[0].MyTable,
    isLoading: !error && !data,
    isError: error,
  }
}
