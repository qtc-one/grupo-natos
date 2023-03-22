import useUser from '@/hooks/useUser'
import fetchJson from '@/utils/fetchJson'
import { useRouter } from 'next/router'

export default function NewsPage() {
  const router = useRouter()
  const { user, mutateUser } = useUser({ redirectTo: '/login' })
  return (
    <div>
      <h1>Notícias</h1>
      <button
        onClick={async (e) => {
          e.preventDefault()
          mutateUser(await fetchJson('/api/session/logout', { method: 'POST' }), false)
        }}
      >
        Sair
      </button>
    </div>
  )
}
