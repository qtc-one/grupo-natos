import { UserSession } from '@/configs/session'
import { Boleto } from '@/pages/api/payment/boletos'
import useSWR from 'swr'

export default function useBoletos(user: UserSession | undefined) {
  const { data, error } = useSWR<Boleto[]>(user?.isLogged ? `/api/payment/boletos` : null)

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  }
}
