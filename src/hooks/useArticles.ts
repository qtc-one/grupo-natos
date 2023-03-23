import { UserSession } from '@/configs/session'
import { ArticlesRouteResponse } from '@/pages/api/articles'
import useSWR from 'swr'

export default function useArticles(user: UserSession | undefined) {
  const { data, error } = useSWR<ArticlesRouteResponse>(user?.isLogged ? `/api/articles` : null)

  return {
    data: data?.data.posts.nodes,
    isLoading: !error && !data,
    isError: error,
  }
}
