import { UserSession } from '@/configs/session'
import useSWR from 'swr'

const fetcher = async (url: string, body: { company: number; building: string; sale: number }) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  return res.json()
}

export default function useDependencies(sale: number, company: number, building: string) {
  const { data, error } = useSWR('/api/payment/dependencies', (url) =>
    fetcher(url, { company, building, sale })
  )

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}
