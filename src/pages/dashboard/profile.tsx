import TemplateDashboard from '@/components/template/Dashboard'
import { Box } from '@/components/ui/atoms/Box'
import { Input } from '@/components/ui/atoms/Input'
import { InputPassword } from '@/components/ui/atoms/InputPassword'
import { useDefaultContext } from '@/contexts/Default'
import useUser from '@/hooks/useUser'
import fetchJson from '@/utils/fetchJson'
import { useRouter } from 'next/router'
import { FormEvent, useCallback } from 'react'

export default function ProfilePage() {
  const { user, mutateUser } = useUser()
  const { setFeedback } = useDefaultContext()
  const router = useRouter()

  const handleChangeProfile = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const body = {
        login: event.currentTarget.login.value,
        email: event.currentTarget.email.value,
        password: event.currentTarget.password.value,
      }

      try {
        await fetchJson('/api/user/access/update', {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })

        setFeedback({
          error: false,
          message:
            'Dados alterados com sucesso! Iremos te deslogar para que a mudanças façam efeito.',
        })

        setTimeout(async () => {
          mutateUser(await fetchJson('/api/logout', { method: 'POST' }), false)
          router.push('/login')
        }, 3000)
      } catch (error) {
        console.error(error)
      }
    },
    [router, mutateUser]
  )
  return (
    <TemplateDashboard title="Perfil" description="">
      <main className="grid place-content-center md:h-[600px]">
        <Box className="max-w-sm">
          <h2 className="text-2xl font-medium mb-6">Alterar credenciais</h2>
          <form className="space-y-4" onSubmit={handleChangeProfile}>
            <Input
              type="text"
              name="login"
              placeholder="Login"
              defaultValue={user?.username}
              required
            />

            <Input
              type="email"
              name="email"
              placeholder="Email"
              defaultValue={user?.email}
              required
            />

            <InputPassword placeholder="Nova Senha" minLength={6} required />

            <button className="w-full flex justify-center items-center gap-2 py-2 border-2 border-blue-700 rounded-full bg-blue-700 text-white font-medium">
              Enviar
            </button>
          </form>
        </Box>
      </main>
    </TemplateDashboard>
  )
}
