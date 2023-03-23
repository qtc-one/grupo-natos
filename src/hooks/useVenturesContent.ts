import { UserSession } from '@/configs/session'
import { ListOfVenturesAPIResponse } from '@/pages/api/ventures/content'
import useSWR from 'swr'

export default function useVenturesContent(user: UserSession | undefined) {
  const { data, error } = useSWR<ListOfVenturesAPIResponse>(
    user?.isLogged ? `/api/ventures/content` : null
  )

  return {
    content: data?.data.ventures.nodes,
    isLoading: !error && !data,
    isError: error,
  }
}
