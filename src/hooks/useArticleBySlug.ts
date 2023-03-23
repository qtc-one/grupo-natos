import { UserSession } from '@/configs/session'
import { SingleArticleAPIResponse } from '@/pages/api/articles/[slug]'
import useSWR from 'swr'

export default function useArticleBySlug(user: UserSession | undefined, slug: string) {
  const { data, error } = useSWR<SingleArticleAPIResponse>(
    user?.isLogged ? `/api/articles/${slug}` : null
  )

  return {
    data: data?.data.postBy,
    isLoading: !error && !data,
    isError: error,
  }
}
